import { action, KeyDownEvent, KeyUpEvent, SingletonAction } from "@elgato/streamdeck";

export type PtzZoom = {
  speed?: number;
  direction: "zoomout" | "zoomin";
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
  const url = `${apiBase}&zoomstop&0`;
  console.log(`Stop: ${url}`);
  await fetch(url);
}

// Ações
@action({ UUID: "ptz.zoom" })
export class PTZZoom extends SingletonAction<PtzZoom> {

  override async onKeyDown(ev: KeyDownEvent<PtzZoom>): Promise<void> {
    await move(ev.payload.settings);
  }

  override async onKeyUp(): Promise<void> {
    await stop();
  }
}

