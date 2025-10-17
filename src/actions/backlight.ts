import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { apiBasePtzPostImageValue } from "../utils/ptz-api-post-image-value";


// Ações
// @action({ UUID: "com.neoid.ptzneoid.backlight" })
// export class Backlight extends SingletonAction {
//   private isBacklight = false;

//   override async onWillAppear(ev: WillAppearEvent) {
//     const globals = await streamDeck.settings.getGlobalSettings();
    
//     const cameraIP = globals.cameraIP;

//     if (!cameraIP) {
//       ev.action.setTitle(`${globals.camera}`)
//       return;
//     }

//     // Converte para booleano corretamente
//     this.isBacklight = globals.isBacklight === true || globals.isBacklight === "true";

//     await ev.action.setTitle(this.isBacklight ? "Backlight\nON" : "Backlight\nOFF");
//   }

//   override async onDidReceiveSettings(ev: DidReceiveSettingsEvent){
//     const globals = await streamDeck.settings.getGlobalSettings();
    
//     const cameraIP = globals.cameraIP;

//     if (!cameraIP) {
//       ev.action.setTitle(`${globals.camera}`)
//       return;
//     }

//     // Converte para booleano corretamente
//     this.isBacklight = globals.isBacklight === true || globals.isBacklight === "true";

//     await ev.action.setTitle(this.isBacklight ? "Backlight\nON" : "Backlight\nOFF");
//   }

//   override async onKeyDown(ev: KeyDownEvent): Promise<void> {
//     const globals = await streamDeck.settings.getGlobalSettings();
//     const cameraIP = globals.cameraIP;

//     ev.action.setTitle(`${globals.camera}`)
//     if (!cameraIP) {
//       ev.action.setTitle(`${globals.camera}`)
//       return;
//     }

//     this.isBacklight = !this.isBacklight;

//     if (this.isBacklight) {
//       const apiBase = apiBasePtzPostImageValue(cameraIP)

//       const url = `${apiBase}&backlight&1`
//       const response = await fetch(url);  

//       const urlNew = `${apiBase}&backlight&2`
//       await fetch(urlNew);  

//       await ev.action.setTitle("Backlight\nON");
//     } else { 
//       const apiBase = apiBasePtzPostImageValue(cameraIP)
//       let url = `${apiBase}&backlight&0`

//       await fetch(url);
      
//       const urlNew = `${apiBase}&backlight&3`
//       await fetch(urlNew);  

//       await ev.action.setTitle("Backlight\nOFF");
//     }

//     await streamDeck.settings.setGlobalSettings({
//       ...globals,
//       isBacklight: this.isBacklight,
//     });
//   }
// }


@action({ UUID: "com.neoid.ptzneoid.backlight" })
export class Backlight extends SingletonAction {
  private isBacklight = false;


  //FN -> config Settings Globals 
  private async getGlobals() {
    return await streamDeck.settings.getGlobalSettings();
  }

  private parseBacklight(value: boolean | string) {
    return value === true || value === "true";
  }

  private async updateTitle(action: any, cameraIP: string, state?: boolean) {
    const globals = await this.getGlobals();
    if(!cameraIP){
      const titleName = globals.camera === undefined ? "No camera" : globals.camera
      await action.setTitle(`${titleName}`)
      return;
    }

    if (state !== undefined) {
      await action.setTitle(state ? "Backlight\nON" : "Backlight\nOFF");
    }
  }

  private async toggleBacklightAPI(cameraIP: string, enable: boolean) {
    const apiBase = apiBasePtzPostImageValue(cameraIP);
    const urlMain = `${apiBase}&backlight&${enable ? 1 : 0}`;
    const urlSecondary = `${apiBase}&backlight&${enable ? 2 : 3}`;

    await fetch(urlMain);
    await fetch(urlSecondary);
  }

  private async refreshState(ev: { action: any }) {
    const globals = await this.getGlobals();
    const cameraIP = globals.cameraIP as string;
    this.isBacklight = this.parseBacklight(globals.isBacklight as string);
    await this.updateTitle(ev.action, cameraIP, this.isBacklight);
  }

  override async onWillAppear(ev: WillAppearEvent) {
    await this.refreshState(ev);
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent) {
    await this.refreshState(ev);
  }

  override async onKeyDown(ev: KeyDownEvent) {
    const globals = await this.getGlobals();
    const cameraIP = globals.cameraIP  as string;

    if(!cameraIP){
      await ev.action.setTitle(`No camera`)
      return
    }

    this.isBacklight = !this.isBacklight;
    await this.toggleBacklightAPI(cameraIP, this.isBacklight);
    await this.updateTitle(ev.action, cameraIP, this.isBacklight);

    await streamDeck.settings.setGlobalSettings({
      ...globals,
      isBacklight: this.isBacklight,
    });
  }
}



