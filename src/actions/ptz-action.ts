import streamDeck, { action, KeyDownEvent, KeyUpEvent, SingletonAction } from "@elgato/streamdeck";
import { apiBaseCMD } from "../utils/ptz-api-base";

export type PtzSettings = {
  speed?: number;
  tilt?: number;
  direction: string;
  selectedCamera: "cam1" | "cam2" | "cam3" | "cam4" | "cam5" | "cam6";
};

// `http://${cameraIp}/ptz?move=${settings.direction}&speed=${settings.speed}&tilt=${settings.tilt}`


async function move(settings: PtzSettings, globals: any) {
  
  const cam = settings.selectedCamera
  const apiBase = apiBaseCMD(cam, globals)
  // const apiBase = `http://192.168.100.88/cgi-bin/ptzctrl.cgi?ptzcmd`

  const speed = settings.speed ?? 5;
  const tilt = settings.tilt ?? 5;
  const direction = settings.direction ?? '';
  const url = `${apiBase}&${direction}&${speed}&${tilt}`;
  console.log(`Move: ${url}`);
  await fetch(url);
}


async function stop(settings: PtzSettings, globals: any) {

  const cam = settings.selectedCamera
  const apiBase = apiBaseCMD(cam, globals)

  const url = `${apiBase}&ptzstop&0&0`;
  console.log(`Stop: ${url}`);
  await fetch(url);
}

// Ações
@action({ UUID: "ptz.control" })
export class PTZControl extends SingletonAction<PtzSettings> {

  override async onKeyDown(ev: KeyDownEvent<PtzSettings>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    await move(ev.payload.settings, globals);
  }

  override async onKeyUp(ev: KeyUpEvent<PtzSettings>): Promise<void> {
    //configuraçoes globais que estao vindo de outro
    const globals = await streamDeck.settings.getGlobalSettings();

    await stop(ev.payload.settings, globals);
  }
}

