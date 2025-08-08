import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { imageSnapShot } from "../utils/snapshot";
// import { toBool } from "./set-action";

type PtzPresetProps = {
  numberPreset: number | "undefined";
};

// Ações
@action({ UUID: "ptz.preset" })
export class PTZPreset extends SingletonAction<PtzPresetProps> {
  private isPreset = false;

  override async onWillAppear(ev: WillAppearEvent<PtzPresetProps>) {
    const globals = await streamDeck.settings.getGlobalSettings();
    const settings = ev.payload.settings;

    // Converte para booleano corretamente
    this.isPreset = globals.isPreset === true || globals.isPreset === "true";

    await ev.action.setTitle(this.isPreset ? "novo Preset" : settings.numberPreset === undefined ? 'Selecione' : `chamar ${settings.numberPreset}` );
  }

  override async onKeyDown(ev: KeyDownEvent<PtzPresetProps>): Promise<void> {
    const settings = ev.payload.settings;
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;
    const isSetActive = globals.isSet;

    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    } 

    // if(settings.numberPreset === undefined) return;

    await ev.action.setTitle(this.isPreset ? "novo Preset" : settings.numberPreset === undefined ? 'Selecione' : `chamar ${settings.numberPreset}` );

    if (isSetActive) {
      
      // salva preset
      await fetch(`http://${cameraIP}/cgi-bin/ptzctrl.cgi?ptzcmd&posset&${settings.numberPreset}`);
      await ev.action.setTitle(`Salvo`);
      await ev.action.setImage(`imgs/actions/set/saved.png`);

      // desativa o modo set
      await streamDeck.settings.setGlobalSettings({
        ...globals,
        isSet: false,
        
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const image = await imageSnapShot(cameraIP)
      await ev.action.setImage(image);
      
    } else {

      // chama preset
      await fetch(`http://${cameraIP}/cgi-bin/ptzctrl.cgi?ptzcmd&poscall&${settings.numberPreset}`);
      await ev.action.setTitle(`Chamar ${settings.numberPreset}`);
    }
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent){
    const settings = ev.payload.settings

    await ev.action.setTitle(this.isPreset ? "novo Preset" : settings.numberPreset === undefined ? 'Selecione' : `chamar ${settings.numberPreset}` );
  }

}