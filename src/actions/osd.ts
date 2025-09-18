import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

type PtzOsdProps = {
  mode: "OSD" | "back";
};

// Ações
@action({ UUID: "com.neoid.ptzneoid.osd" })
export class Osd extends SingletonAction<PtzOsdProps> {
  private isOsd = false;

  override async onWillAppear(ev: WillAppearEvent<PtzOsdProps>) {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;
    const mode = ev.payload.settings.mode;

    if (!cameraIP) {
      await ev.action.setTitle(`${globals.camera}`)
      return;
    }

   if(mode === "back"){
      await ev.action.setTitle("Back OSB");
      await ev.action.setImage(`imgs/actions/back`);
    } else {
      this.isOsd = globals.isOsd === true || globals.isOsd === "true";
      await ev.action.setTitle("");
      await ev.action.setImage(`imgs/actions/osd`);
    }
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PtzOsdProps>){
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;
    const mode = ev.payload.settings.mode;

    if (!cameraIP) {
      await ev.action.setTitle(`${globals.camera}`)
      return;
    }

    // Converte para booleano corretamente
    if(mode === "back"){
      await ev.action.setTitle("Back OSB");
      await ev.action.setImage(`imgs/actions/back`);
    } else {
      this.isOsd = globals.isOsd === true || globals.isOsd === "true";
      await ev.action.setTitle("");
      await ev.action.setImage(`imgs/actions/osd`);
    }
  }

  override async onKeyDown(ev: KeyDownEvent<PtzOsdProps>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    const mode = ev.payload.settings.mode;

    if (!cameraIP) {
      await ev.action.setTitle(`${globals.camera}`)
      return;
    }

    if(mode === "back"){

      const response = await fetch(`http://${cameraIP}/cgi-bin/param.cgi?navigate_mode&OSD_BACK`)

      if (!response.ok) {
        await ev.action.setTitle("");
        await ev.action.setImage(`imgs/actions/error.png`);
        return
      }
      await ev.action.setTitle("Back OSB");
      await ev.action.setImage(`imgs/actions/back`);

    } else {

      await ev.action.setImage(`imgs/actions/osd`);
      this.isOsd = !this.isOsd;

      if (this.isOsd) {
        const response = await fetch(`http://${cameraIP}/cgi-bin/param.cgi?navigate_mode&OSD`)

        if (!response.ok) {
          await ev.action.setTitle("");
          await ev.action.setImage(`imgs/actions/error.png`);
          return
        }
      } else {
        const response = await fetch(`http://${cameraIP}/cgi-bin/param.cgi?navigate_mode&PTZ`)

        if (!response.ok) {
          await ev.action.setTitle("");
          await ev.action.setImage(`imgs/actions/error.png`);
          return;
        }
      }
    

      await streamDeck.settings.setGlobalSettings({
        ...globals,
        isOsd: this.isOsd,
      });
    }

    
  }
}

