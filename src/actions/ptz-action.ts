import { action, KeyDownEvent, KeyUpEvent, SingletonAction } from "@elgato/streamdeck";
import type { PTZSettings } from "../types";

const apiBase = "http://192.168.100.88/cgi-bin/ptzctrl.cgi?ptzcmd";

async function move(direction: string, settings: PTZSettings) {
  const speed = settings.speed ?? 5;
  const tilt = settings.tilt ?? 5;
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
@action({ UUID: "ptz.up" })
export class PTZUp extends SingletonAction<PTZSettings> {
  override async onKeyDown(ev: KeyDownEvent<PTZSettings>): Promise<void> {
    await move("up", ev.payload.settings);
  }

  override async onKeyUp(): Promise<void> {
    await stop();
  }
}

@action({ UUID: "ptz.down" })
export class PTZDown extends SingletonAction<PTZSettings> {
  override async onKeyDown(ev: KeyDownEvent<PTZSettings>): Promise<void> {
    await move("down", ev.payload.settings);
  }

  override async onKeyUp(): Promise<void> {
    await stop();
  }
}

@action({ UUID: "ptz.left" })
export class PTZLeft extends SingletonAction<PTZSettings> {
  override async onKeyDown(ev: KeyDownEvent<PTZSettings>): Promise<void> {
    await move("left", ev.payload.settings);
  }

  override async onKeyUp(): Promise<void> {
    await stop();
  }
}

@action({ UUID: "ptz.right" })
export class PTZRight extends SingletonAction<PTZSettings> {
  override async onKeyDown(ev: KeyDownEvent<PTZSettings>): Promise<void> {
    await move("right", ev.payload.settings);
  }

  override async onKeyUp(): Promise<void> {
    await stop();
  }
}
