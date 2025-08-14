import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";


// Ações
@action({ UUID: "com.neoid.ptzneoid.pattern" })
export class Pattern extends SingletonAction {

  override async onWillAppear(ev: WillAppearEvent){
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }
    ev.action.setTitle("Padrão");
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

    const response = await fetch(`http://${cameraIP}/cgi-bin/param.cgi?get_image_default_conf`)
    if(response.ok)ev.action.showOk()
  }
}

