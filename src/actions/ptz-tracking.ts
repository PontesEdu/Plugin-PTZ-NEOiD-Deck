import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendViscaUDP } from "../utils/send-visca-udp";

type PtzTrackingProps = {
  mode: "on" | "off";
};

// Ações
@action({ UUID: "com.neoid.ptzneoid.ptz-tracking" })
export class PTZTracking extends SingletonAction<PtzTrackingProps> {
  private isTracking = false;

  override async onWillAppear(ev: WillAppearEvent<PtzTrackingProps>) {
    const globals = await streamDeck.settings.getGlobalSettings();
    
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

    // Converte para booleano corretamente
    this.isTracking = globals.isTracking === true || globals.isTracking === "true";

    await ev.action.setTitle(this.isTracking ? "Tracking\nON" : "Tracking\nOFF");
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PtzTrackingProps>){
    const globals = await streamDeck.settings.getGlobalSettings();
    
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

    // Converte para booleano corretamente
    this.isTracking = globals.isTracking === true || globals.isTracking === "true";

    await ev.action.setTitle(this.isTracking ? "Tracking\nON" : "Tracking\nOFF");
  }

  override async onKeyDown(ev: KeyDownEvent<PtzTrackingProps>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

    this.isTracking = !this.isTracking;

    if (this.isTracking) {
      sendViscaUDP(cameraIP, "81 0a 11 54 02 ff"); // LIGA
      await ev.action.setTitle("Tracking\n ON");
      ev.action.setImage(`imgs/actions/tracking/tracking-on.png`)
    } else { 
      sendViscaUDP(cameraIP, "81 0a 11 54 03 ff"); // DESLIGA (ajuste se for diferente)
      await ev.action.setTitle("Tracking\n OFF");
      ev.action.setImage(`imgs/actions/tracking/tracking-off.png`)
    }

    await streamDeck.settings.setGlobalSettings({
      ...globals,
      isTracking: this.isTracking,
    });
  }
}

