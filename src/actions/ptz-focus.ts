import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction } from "@elgato/streamdeck";
import { apiBaseCMD } from "../utils/ptz-api-base";

export type PtzFocus = {
  speed?: number;
  direction: "focusout" | "focusin" | "auto";
  mode: "mfocus" | "afocus";
  cameraIP: any;
};

async function move(settings: PtzFocus, cameraIP: any) {

  const apiBase = apiBaseCMD(cameraIP)

  const speed = settings.speed ?? 5;
  const direction = settings.direction ?? '';
  const mode = settings.mode ?? 'afocus';
  const urlMode = `${apiBase}&${mode}`; // manual ou automatico
  const url = `${apiBase}&${direction}&${speed}`;
  console.log(`Move: ${url}`);
  await fetch(urlMode);
  await fetch(url);
}

async function stop(cameraIP: any) {

  const apiBase = apiBaseCMD(cameraIP)

  const url = `${apiBase}&focusstop&0`;
  console.log(`Stop: ${url}`);
  await fetch(url);
}

// Ações
@action({ UUID: "ptz.focus" })
export class PTZFocus extends SingletonAction<PtzFocus> {

  override async onKeyDown(ev: KeyDownEvent<PtzFocus>): Promise<void> {
    const settings = ev.payload.settings

    if(settings.direction) {
      ev.action.setTitle(`${settings.direction}`)
      ev.action.setImage(`imgs/actions/focus/${settings.direction}.png`)
    }

    if(settings.mode === "afocus"){
      ev.action.setTitle(`Auto`)
      ev.action.setImage(`imgs/actions/focus/auto.png`)
    }

    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP
    if(cameraIP){
      await move(settings, cameraIP);
    } else{
      ev.action.setTitle(`Sem Camera`)
    }
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PtzFocus>){
    const settings = ev.payload.settings

    if(settings.direction) {
      ev.action.setTitle(`${settings.direction}`)
      ev.action.setImage(`imgs/actions/focus/${settings.direction}.png`)
    }

    if(settings.mode === "afocus"){
      ev.action.setTitle(`Auto`)
      ev.action.setImage(`imgs/actions/focus/auto.png`)
    }

    await streamDeck.settings.getGlobalSettings();
  }

  override async onKeyUp(ev: KeyUpEvent<PtzFocus>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP
    await stop(cameraIP);
  }
}

