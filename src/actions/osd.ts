import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

type PtzOsdProps = {
  mode: "on" | "off";
};

// Ações
@action({ UUID: "com.neoid.ptzneoid.osd" })
export class Osd extends SingletonAction<PtzOsdProps> {
  private isOsd = false;

  override async onWillAppear(ev: WillAppearEvent<PtzOsdProps>) {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle(`${globals.camera}`)
      return;
    }

    // Converte para booleano corretamente
    this.isOsd = globals.isOsd === true || globals.isOsd === "true";

    await ev.action.setTitle(this.isOsd ? "OSD" : "PTZ");
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PtzOsdProps>){
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle(`${globals.camera}`)
      return;
    }

    // Converte para booleano corretamente
    this.isOsd = globals.isOsd === true || globals.isOsd === "true";

    await ev.action.setTitle(this.isOsd ? "OSD" : "PTZ");
  }

  override async onKeyDown(ev: KeyDownEvent<PtzOsdProps>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle(`${globals.camera}`)
      return;
    }

    this.isOsd = !this.isOsd;

    if (this.isOsd) {
      await fetch(`http://${cameraIP}/cgi-bin/param.cgi?navigate_mode&OSD`)
      await ev.action.setTitle(this.isOsd ? "OSD" : "PTZ");
    } else {
      await fetch(`http://${cameraIP}/cgi-bin/param.cgi?navigate_mode&PTZ`)
      await ev.action.setTitle(this.isOsd ? "OSD" : "PTZ");
    }

    await streamDeck.settings.setGlobalSettings({
      ...globals,
      isOsd: this.isOsd,
    });
  }
}

