import streamDeck, { action, KeyDownEvent, KeyUpEvent, SingletonAction } from "@elgato/streamdeck";
import { getCameraApiBase } from "../utils/ptz-api-base";

export type PtzFocus = {
  speed?: number;
  direction: "focusout" | "focusin" | "auto";
  mode: "mfocus" | "afocus";
  selectedCamera: "cam1" | "cam2" | "cam3" | "cam4" | "cam5" | "cam6";
};

async function move(settings: PtzFocus, globals: any) {

  const cam = settings.selectedCamera
  const apiBase = getCameraApiBase(cam, globals)

  const speed = settings.speed ?? 5;
  const direction = settings.direction ?? '';
  const mode = settings.mode ?? 'afocus';
  const urlMode = `${apiBase}&${mode}`; // manual ou automatico
  const url = `${apiBase}&${direction}&${speed}`;
  console.log(`Move: ${url}`);
  await fetch(urlMode);
  await fetch(url);
}

async function stop(settings: PtzFocus, globals: any) {

  const cam = settings.selectedCamera
  const apiBase = getCameraApiBase(cam, globals)

  const url = `${apiBase}&focusstop&0`;
  console.log(`Stop: ${url}`);
  await fetch(url);
}

// Ações
@action({ UUID: "ptz.focus" })
export class PTZFocus extends SingletonAction<PtzFocus> {

  override async onKeyDown(ev: KeyDownEvent<PtzFocus>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    await move(ev.payload.settings, globals);
  }

  override async onKeyUp(ev: KeyUpEvent<PtzFocus>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    await stop(ev.payload.settings, globals);
  }
}

