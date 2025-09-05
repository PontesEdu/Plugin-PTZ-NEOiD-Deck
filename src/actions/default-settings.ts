import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent} from "@elgato/streamdeck";

// Ações
@action({ UUID: "com.neoid.ptzneoid.default" })
export class Default extends SingletonAction {

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    const settings = ev.payload.settings;
    const typeDefault = settings.typeDefault as "image" | "speed";


    if (!cameraIP) {
      ev.action.setTitle(`${globals.camera}`)
      return;
    }
    

    if (!["image", "speed"].includes(typeDefault)) {
      await ev.action.setTitle("Selecione");
      return;
    }


    if(typeDefault === 'speed'){
      await streamDeck.settings.setGlobalSettings({
        ...globals,
        [`panMode`]: "normal",
        [`zoomMode`]: "normal",
        [`focusMode`]: "normal",
      });
      ev.action.showOk()
      await ev.action.setTitle(`${typeDefault}`);

    } else {
      const response = await fetch(`http://${cameraIP}/cgi-bin/param.cgi?get_image_default_conf`)

      if(response.ok) {
        ev.action.showOk()
        await ev.action.setTitle(`${typeDefault}`);

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

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent) {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP
    const typeDefault = ev.payload.settings.typeDefault  as "image" | "speed";
    
    if(!cameraIP){
      ev.action.setTitle(`${globals.camera}`)
      return;
    }

    if (!["image", "speed"].includes(typeDefault)) {
      await ev.action.setTitle("Selecione");
      return;
    }


    if(typeDefault === "speed") {
      ev.action.setTitle(`${typeDefault}`)
      return;
    }

    ev.action.setTitle(`${typeDefault}`)
  }


  override async onWillAppear(ev: WillAppearEvent){
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP
    const typeDefault = ev.payload.settings.typeDefault as "image" | "speed";
    
    if(!cameraIP){
      ev.action.setTitle(`${globals.camera}`)
      return;
    }

    if(!["image", "speed"].includes(typeDefault)) {
      await ev.action.setTitle("Selecione");
      return;
    }

    if(typeDefault === "speed") {
      ev.action.setTitle(`${typeDefault}`)
      return;
    }

    ev.action.setTitle(`${typeDefault}`)
  }
}

