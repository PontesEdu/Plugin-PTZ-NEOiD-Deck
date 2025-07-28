import { action, KeyDownEvent, KeyUpEvent, SingletonAction } from "@elgato/streamdeck";
import type { PTZSettings } from "../types";

const apiBase = "http://192.168.100.88/cgi-bin/ptzctrl.cgi?ptzcmd";

async function move(settings: PTZSettings) {
  const speed = settings.speed ?? 5;
  const tilt = settings.tilt ?? 5;
  const direction = settings.direction ?? '';
  const url = `${apiBase}&${direction}&${speed}&${tilt}`;
  console.log(`Move: ${url}`);
  await fetch(url);
}

async function stop() {
  const url = `${apiBase}&ptzstop&0&0`;
  console.log(`Stop: ${url}`);
  await fetch(url);
}

// Ações
@action({ UUID: "ptz.control" })
export class PTZControl extends SingletonAction<PTZSettings> {
  override async onKeyDown(ev: KeyDownEvent<PTZSettings>): Promise<void> {
    await move(ev.payload.settings);
  }

  override async onKeyUp(): Promise<void> {
    await stop();
  }
}

