import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { apiBasePtzPostImageValue } from "../utils/ptz-api-post-image-value";


// Ações
@action({ UUID: "com.neoid.ptzneoid.backlight" })
export class Backlight extends SingletonAction {
  private isBacklight = false;

  // override async onWillAppear(ev: WillAppearEvent) {
  //   const globals = await streamDeck.settings.getGlobalSettings();
    
  //   const cameraIP = globals.cameraIP;

  //   if (!cameraIP) {
  //     ev.action.setTitle(`${globals.camera}`)
  //     return;
  //   }

  //   // Converte para booleano corretamente
  //   this.isBacklight = globals.isBacklight === true || globals.isBacklight === "true";

  //   await ev.action.setTitle(this.isBacklight ? "Backlight\nON" : "Backlight\nOFF");
  // }

  // override async onDidReceiveSettings(ev: DidReceiveSettingsEvent){
  //   const globals = await streamDeck.settings.getGlobalSettings();
    
  //   const cameraIP = globals.cameraIP;

  //   if (!cameraIP) {
  //     ev.action.setTitle(`${globals.camera}`)
  //     return;
  //   }

  //   // Converte para booleano corretamente
  //   this.isBacklight = globals.isBacklight === true || globals.isBacklight === "true";

  //   await ev.action.setTitle(this.isBacklight ? "Backlight\nON" : "Backlight\nOFF");
  // }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    ev.action.setTitle(`${globals.camera}`)
    if (!cameraIP) {
      ev.action.setTitle(`${globals.camera}`)
      return;
    }

    this.isBacklight = !this.isBacklight;

    if (this.isBacklight) {
      const apiBase = apiBasePtzPostImageValue(cameraIP)
      const url = `${apiBase}&backlight&1`
      
      const response = await fetch(url);  

      if (!response.ok) {
        await ev.action.setTitle("");
        await ev.action.setImage(`imgs/actions/error.png`);
        return;
      }

      await ev.action.setTitle("Backlight\nON");
    } else { 
      const apiBase = apiBasePtzPostImageValue(cameraIP)
      const url = `${apiBase}&backlight&0`

      const response = await fetch(url);  

      if (!response.ok) {
        await ev.action.setTitle("");
        await ev.action.setImage(`imgs/actions/error.png`);
        return;
      }

      await ev.action.setTitle("Backlight\nOFF");
    }

    await streamDeck.settings.setGlobalSettings({
      ...globals,
      isBacklight: this.isBacklight,
    });
  }
}

