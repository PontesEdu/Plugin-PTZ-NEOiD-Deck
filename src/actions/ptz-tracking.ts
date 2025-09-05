import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendViscaTCP } from "../utils/send-visca-tcp";
import { apiBasePtzPostImageValue } from "../utils/ptz-api-post-image-value";



// Ações
@action({ UUID: "com.neoid.ptzneoid.ptz-tracking" })
export class PTZTracking extends SingletonAction {
  private isTracking = false;

  override async onWillAppear(ev: WillAppearEvent) {
    const globals = await streamDeck.settings.getGlobalSettings();
    
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      ev.action.setTitle(`${globals.camera}`)
      return;
    }

    // Converte para booleano corretamente
    this.isTracking = globals.isTracking === true || globals.isTracking === "true";

    await ev.action.setTitle(this.isTracking ? "Tracking\nON" : "Tracking\nOFF");
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent){
    const globals = await streamDeck.settings.getGlobalSettings();
    const settings = ev.payload.settings
    
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      ev.action.setTitle(`${globals.camera}`)
      return;
    }

    // Converte para booleano corretamente
    this.isTracking = globals.isTracking === true || globals.isTracking === "true";

    await ev.action.setTitle(this.isTracking ? "Tracking\nON" : "Tracking\nOFF");
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      ev.action.setTitle(`${globals.camera}`)
      return;
    }
    
    this.isTracking = !this.isTracking;

    if (this.isTracking) {
      sendViscaTCP(cameraIP, "81 0a 11 54 02 ff"); // LIGA
      await ev.action.setTitle("Tracking\n ON");
      ev.action.setImage(`imgs/actions/tracking/tracking-on.png`)
    } else { 
      sendViscaTCP(cameraIP, "81 0a 11 54 03 ff"); // DESLIGA (ajuste se for diferente)
      await ev.action.setTitle("Tracking\n OFF");
      ev.action.setImage(`imgs/actions/tracking/tracking-off.png`)
    }

    await streamDeck.settings.setGlobalSettings({
      ...globals,
      isTracking: this.isTracking,
    });
  }
}

