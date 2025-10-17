import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { imageSnapShot } from "../utils/snapshot";

type PtzPresetProps = {
  numberPreset: number | "undefined";
  image: boolean
};

@action({ UUID: "com.neoid.ptzneoid.ptz-preset" })
export class PTZPreset extends SingletonAction<PtzPresetProps> {
  // private presetImages: PresetImage[] = [];
  private pressTimer?: NodeJS.Timeout;
  private longPress = false;

  override async onWillAppear(ev: WillAppearEvent<PtzPresetProps>) {
    const settings = ev.payload.settings;
    const presetNumber = settings.numberPreset === undefined ? 0 : Number(settings.numberPreset);
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP;

    if(!cameraIP){
      await ev.action.setTitle(`No camera`)
      return
    }

    if (!isNaN(presetNumber)) {
      
      if(settings.image){
        const image = globals[`presetImage${presetNumber}${cameraIP}`]
        await ev.action.setImage(`${image}`);
      } else {
        await ev.action.setImage("");
      }
      await ev.action.setTitle(`call: ${presetNumber}`);
      
    } else {
      await ev.action.setImage("imgs/actions/preset/preset.png");
      await ev.action.setTitle("Select");
    }
  }

  override async onKeyDown(ev: KeyDownEvent<PtzPresetProps>) {
    const settings = ev.payload.settings;
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;
    const presetNumber = settings.numberPreset === undefined ? 0 : Number(settings.numberPreset);

    if (!cameraIP || isNaN(presetNumber)) {
      await ev.action.setTitle(`No camera`)
      return
    }

    // Começa a contar o tempo do pressionamento
    this.longPress = false;
    this.pressTimer = setTimeout(() => {
      this.longPress = true;
      this.savePreset(ev, String(cameraIP), presetNumber); // salva após 1s
    }, 1100);
  }

  override async onKeyUp(ev: KeyUpEvent<PtzPresetProps>) {
    clearTimeout(this.pressTimer);

    const settings = ev.payload.settings;
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;
    const presetNumber = settings.numberPreset === undefined ? 0 : Number(settings.numberPreset);

    if (!cameraIP || isNaN(presetNumber)) return;
    
    // Se não foi um clique longo, chama o preset
    if (!this.longPress) {
      await fetch(`http://${cameraIP}/cgi-bin/ptzctrl.cgi?ptzcmd&poscall&${presetNumber}`);

      if(settings.image){
        const image = globals[`presetImage${presetNumber}${cameraIP}`]
        await ev.action.setImage(`${image}`);
      } else {
        await ev.action.setImage("");
      }

      await ev.action.setTitle(`call: ${presetNumber}`);
    }
  }

  private async savePreset(ev: KeyDownEvent<PtzPresetProps>, cameraIP: string, presetNumber: number) {
    // salva preset na câmera
    await fetch(`http://${cameraIP}/cgi-bin/ptzctrl.cgi?ptzcmd&posset&${presetNumber}`);
    await ev.action.setTitle(`save`);
    await ev.action.setImage(`imgs/actions/set/saved.png`);
    const settings = ev.payload.settings;

    await new Promise(resolve => setTimeout(resolve, 700));
    
    const snapshot = await imageSnapShot(cameraIP);
    await ev.action.setTitle(`call: ${presetNumber}`);
  
    

    const globals = await streamDeck.settings.getGlobalSettings();

    if(settings.image){

      await streamDeck.settings.setGlobalSettings({
        ...globals,
        [`presetImage${presetNumber}${cameraIP}`]: snapshot
      });

      await ev.action.setImage(snapshot);
    } else {
      await ev.action.setImage("");
    }
    
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent) {
    const settings = ev.payload.settings;
    const presetNumber = settings.numberPreset === undefined ? 0 : Number(settings.numberPreset);
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP;

    if(!cameraIP){
      await ev.action.setTitle(`No camera`)
      return
    }

    if (!isNaN(presetNumber)) {
      if(settings.image){
        const image = globals[`presetImage${presetNumber}${cameraIP}`]
        await ev.action.setImage(`${image}`);
      } else {
        await ev.action.setImage("");
      }

      await ev.action.setTitle(`call: ${presetNumber}`);
    } else {
      await ev.action.setImage("imgs/actions/preset/preset.png");
      await ev.action.setTitle("Select");
    }
  }
}


