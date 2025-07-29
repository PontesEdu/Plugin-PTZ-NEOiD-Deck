import { action, KeyDownEvent, KeyUpEvent, SingletonAction } from "@elgato/streamdeck";

export type PtzFocus = {
  speed?: number;
  direction: "focusout" | "focusin";
};

const apiBase = "http://192.168.100.88/cgi-bin/ptzctrl.cgi?ptzcmd";

async function move(settings: any) {
  const speed = settings.speed ?? 5;
  const direction = settings.direction ?? '';
  const url = `${apiBase}&${direction}&${speed}`;
  console.log(`Move: ${url}`);
  await fetch(url);
}

async function stop() {
  const url = `${apiBase}&focusstop&0`;
  console.log(`Stop: ${url}`);
  await fetch(url);
}

// Ações
@action({ UUID: "ptz.focus" })
export class PTZFocus extends SingletonAction<PtzFocus> {

  override async onKeyDown(ev: KeyDownEvent<PtzFocus>): Promise<void> {
    await move(ev.payload.settings);
  }

  override async onKeyUp(): Promise<void> {
    await stop();
  }
}

