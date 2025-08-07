import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

import { sendViscaUDP } from "../utils/send-visca-udp";

type PtzRecordProps = {
  mode: "on" | "off";
};

// Ações
@action({ UUID: "ptz.record" })
export class PTZRecord extends SingletonAction<PtzRecordProps> {
  private isRecord = false;

  override async onWillAppear(ev: WillAppearEvent<PtzRecordProps>) {
    const globals = await streamDeck.settings.getGlobalSettings();

    // Converte para booleano corretamente
    this.isRecord = globals.isRecord === true || globals.isRecord === "true";

    await ev.action.setTitle(this.isRecord ? "Record ON" : "Record OFF");
  }

  override async onKeyDown(ev: KeyDownEvent<PtzRecordProps>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

    this.isRecord = !this.isRecord;

    if (this.isRecord) {
      sendViscaUDP(cameraIP, "81 0a 03 01 02 ff"); // LIGA
      await ev.action.setTitle("rec: ON");
      ev.action.setImage(`imgs/actions/record/rec-on.png`)
    } else {
      sendViscaUDP(cameraIP, "81 0a 03 01 03 ff"); // DESLIGA (ajuste se for diferente)
      await ev.action.setTitle("rec OFF");
      ev.action.setImage(`imgs/actions/record/rec.png`)
    }
    

    await streamDeck.settings.setGlobalSettings({
      ...globals,
      isRecord: this.isRecord,
    });
  }

}

