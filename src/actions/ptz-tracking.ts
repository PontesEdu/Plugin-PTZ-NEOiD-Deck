import streamDeck, { action, KeyDownEvent, KeyUpEvent, SingletonAction } from "@elgato/streamdeck";

type PtzTrackingProps = {
  mode: "on" | "off";
};

const apiBase = "http://192.168.100.88/cgi-bin/param.cgi?set_overlay&autotracking";

async function move(settings: PtzTrackingProps, globals: any) {
  const mode = settings.mode;
  const url = `${apiBase}&${mode}`;
  console.log(`Move: ${url}`);
  await fetch(url);
}


// Ações
@action({ UUID: "ptz.tracking" })
export class PTZTracking extends SingletonAction<PtzTrackingProps> {

  override async onKeyDown(ev: KeyDownEvent<PtzTrackingProps>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    await move(ev.payload.settings, globals);
  }

  // override async onKeyUp(): Promise<void> {
  //   await stop();
  // }
}

