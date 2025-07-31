import streamDeck, { action, KeyDownEvent, KeyUpEvent, SingletonAction } from "@elgato/streamdeck";
import { getCameraApiBase } from "../utils/ptz-api-base";

export type PtzZoom = {
  speed?: number;
  direction: "zoomout" | "zoomin";
  selectedCamera: "cam1" | "cam2" | "cam3" | "cam4" | "cam5" | "cam6";
};


async function move(settings: PtzZoom, globals: any) {

  const cam = settings.selectedCamera
  const apiBase = getCameraApiBase(cam, globals)

  const speed = settings.speed ?? 5;
  const direction = settings.direction ?? '';
  const url = `${apiBase}&${direction}&${speed}`;
  console.log(`Move: ${url}`);
  await fetch(url);
}

async function stop(settings: PtzZoom, globals: any) {

  const cam = settings.selectedCamera
  const apiBase = getCameraApiBase(cam, globals)

  const url = `${apiBase}&zoomstop&0`;
  console.log(`Stop: ${url}`);
  await fetch(url);
}

// Ações
@action({ UUID: "ptz.zoom" })
export class PTZZoom extends SingletonAction<PtzZoom> {

  override async onKeyDown(ev: KeyDownEvent<PtzZoom>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    await move(ev.payload.settings, globals);
  }

  override async onKeyUp(ev: KeyUpEvent<PtzZoom>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    await stop(ev.payload.settings, globals);
  }
}

