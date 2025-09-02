import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

import { sendViscaUDP } from "../utils/send-visca-udp";



// Ações
@action({ UUID: "com.neoid.ptzneoid.ptz-record" })
export class PTZRecord extends SingletonAction {
  private isRecord = false;

  override async onWillAppear(ev: WillAppearEvent) {
    const globals = await streamDeck.settings.getGlobalSettings();

    // Converte para booleano corretamente
    this.isRecord = globals.isRecord === true || globals.isRecord === "true";

    await ev.action.setTitle(this.isRecord ? "recording" : "rec: OFF");
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle(`${globals.camera}`)
      return;
    }

    this.isRecord = !this.isRecord;

    if (this.isRecord) {
      sendViscaUDP(cameraIP, "81 0a 03 01 02 ff"); // LIGA
      await ev.action.setTitle("recording");
      ev.action.setImage(`imgs/actions/record/recording.png`)
    } else {
      sendViscaUDP(cameraIP, "81 0a 03 01 03 ff"); // DESLIGA (ajuste se for diferente)
      await ev.action.setTitle("rec OFF");
      ev.action.setImage(`imgs/actions/record/record.png`)
    }
    

    await streamDeck.settings.setGlobalSettings({
      ...globals,
      isRecord: this.isRecord,
    });
  }

}

