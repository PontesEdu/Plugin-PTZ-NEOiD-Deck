import streamDeck, { action, KeyDownEvent, SingletonAction} from "@elgato/streamdeck";

// Ações
@action({ UUID: "com.neoid.ptzneoid.default" })
export class Default extends SingletonAction {

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }
    await ev.action.setTitle("");
    
    const response = await fetch(`http://${cameraIP}/cgi-bin/param.cgi?get_image_default_conf`)

    if(response.ok) {
      ev.action.showOk()

      await streamDeck.settings.setGlobalSettings({
        ...globals,
        [`hueLevel`]: 6,
        [`saturationLevel`]: 60,
        [`rgaintuningLevel`]: 4,
        [`bgaintuningLevel`]: 4,
        [`colortempLevel`]: 65,
        [`contrastLevel`]: 4,
        [`luminanceLevel`]: 5,
        [`sharpnessLevel`]: 0,
        [`irisLevel`]: 3,
        [`shutterLevel`]: 2,
        [`gainLevel`]: 3,
        [`gainLimitLevel`]: 6,
        [`meterLevel`]: 0,
      });
    }
  }
}

