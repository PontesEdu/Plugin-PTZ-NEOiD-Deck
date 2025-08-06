import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction } from "@elgato/streamdeck";
import { apiBaseCMD } from "../utils/ptz-api-base";

export type PtzZoom = {
  speed?: number;
  direction: "zoomout" | "zoomin";
  cameraIP: any;
};

async function move(settings: PtzZoom, globals: any) {
  const apiBase = apiBaseCMD(globals.cameraIP)

  const speed = globals.zoomSpeed;
  const direction = settings.direction ?? '';
  const url = `${apiBase}&${direction}&${speed}`;
  console.log(`Move: ${url}`);
  await fetch(url);
}

async function stop(cameraIP: any) {

  const apiBase = apiBaseCMD(cameraIP)

  const url = `${apiBase}&zoomstop&0`;
  console.log(`Stop: ${url}`);
  await fetch(url);
}

// Ações
@action({ UUID: "ptz.zoom" })
export class PTZZoom extends SingletonAction<PtzZoom> {

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PtzZoom>) {
    const settings = ev.payload.settings

    if(settings.direction) {
      ev.action.setTitle(`${settings.direction}`)
      ev.action.setImage(`imgs/actions/search/${settings.direction}.png`)
    }

    await streamDeck.settings.getGlobalSettings();
  }

  override async onKeyDown(ev: KeyDownEvent<PtzZoom>): Promise<void> {
    const settings = ev.payload.settings

    if(settings.direction) {
      ev.action.setTitle(`${settings.direction}`)
      ev.action.setImage(`imgs/actions/search/${settings.direction}.png`)
    }

    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP
    if(cameraIP){
      await move(settings, globals);
    } else{
      ev.action.setTitle(`Sem Camera`)
    }
  }

  override async onKeyUp(ev: KeyUpEvent<PtzZoom>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP
    await stop(cameraIP);
  }

  
}

