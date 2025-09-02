import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { apiBasePtzPostImageValue } from "../utils/ptz-api-post-image-value";


// Ações
@action({ UUID: "com.neoid.ptzneoid.backlight" })
export class Backlight extends SingletonAction {
  private isBacklight = false;

  override async onWillAppear(ev: WillAppearEvent) {
    const globals = await streamDeck.settings.getGlobalSettings();
    
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      ev.action.setTitle(`${globals.camera}`)
      return;
    }

    // Converte para booleano corretamente
    this.isBacklight = globals.isBacklight === true || globals.isBacklight === "true";

    await ev.action.setTitle(this.isBacklight ? "Backlight\nON" : "Backlight\nOFF");
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent){
    const globals = await streamDeck.settings.getGlobalSettings();
    
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      ev.action.setTitle(`${globals.camera}`)
      return;
    }

    // Converte para booleano corretamente
    this.isBacklight = globals.isBacklight === true || globals.isBacklight === "true";

    await ev.action.setTitle(this.isBacklight ? "Backlight\nON" : "Backlight\nOFF");
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      ev.action.setTitle(`${globals.camera}`)
      return;
    }

    this.isBacklight = !this.isBacklight;

    if (this.isBacklight) {
      const apiBase = apiBasePtzPostImageValue(cameraIP)
      const url = `${apiBase}&backlight&1`
      
      await fetch(url)

      await ev.action.setTitle("Backlight\n ON");
    } else { 
      const apiBase = apiBasePtzPostImageValue(cameraIP)
      const url = `${apiBase}&backlight&0`

      await fetch(url)

      await ev.action.setTitle("Backlight\n OFF");
    }

    await streamDeck.settings.setGlobalSettings({
      ...globals,
      isBacklight: this.isBacklight,
    });
  }
}

