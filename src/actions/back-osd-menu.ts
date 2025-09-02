import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";


// Ações
@action({ UUID: "com.neoid.ptzneoid.back-osd-menu" })
export class BackOsdMenu extends SingletonAction{

  override async onWillAppear(ev: WillAppearEvent) {
    await ev.action.setTitle("BACK OSB");
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent){
    await ev.action.setTitle("BACK OSB");
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      ev.action.setTitle(`${globals.camera}`)
      return;
    }

    await fetch(`http://${cameraIP}/cgi-bin/param.cgi?navigate_mode&OSD_BACK`)
    await ev.action.setTitle("BACK OSB");
  }
}

