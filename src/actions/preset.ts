import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { imageSnapShot } from "../utils/snapshot";

type PtzPresetProps = {
  numberPreset: number | "undefined";
};

interface PresetImage {
  numberPreset: number;
  image: string;
}

@action({ UUID: "com.neoid.ptzneoid.ptz-preset" })
export class PTZPreset extends SingletonAction<PtzPresetProps> {
  private presetImages: PresetImage[] = [];
  private pressTimer?: NodeJS.Timeout;
  private longPress = false;

  override async onWillAppear(ev: WillAppearEvent<PtzPresetProps>) {
    const settings = ev.payload.settings;
    const presetNumber = Number(settings.numberPreset);

    if (!isNaN(presetNumber)) {
      const found = this.presetImages.find(p => p.numberPreset === presetNumber);
      await ev.action.setImage(found ? found.image : "imgs/actions/preset/preset.png");
      await ev.action.setTitle(`chamar ${presetNumber}`);
    } else {
      await ev.action.setImage("imgs/actions/preset/preset.png");
      await ev.action.setTitle("Selecione");
    }
  }

  override async onKeyDown(ev: KeyDownEvent<PtzPresetProps>) {
    const settings = ev.payload.settings;
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;
    const presetNumber = Number(settings.numberPreset);

    if (!cameraIP || isNaN(presetNumber)) {
      await ev.action.setTitle("Sem Câmera");
      return;
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
    const presetNumber = Number(settings.numberPreset);

    if (!cameraIP || isNaN(presetNumber)) return;

    // Se não foi um clique longo, chama o preset
    if (!this.longPress) {
      await fetch(`http://${cameraIP}/cgi-bin/ptzctrl.cgi?ptzcmd&poscall&${presetNumber}`);
      await ev.action.setTitle(`Chamar ${presetNumber}`);
    }
  }

  private async savePreset(ev: KeyDownEvent<PtzPresetProps>, cameraIP: string, presetNumber: number) {
    // salva preset na câmera
    await fetch(`http://${cameraIP}/cgi-bin/ptzctrl.cgi?ptzcmd&posset&${presetNumber}`);
    await ev.action.setTitle(`Salvo`);
    await ev.action.setImage(`imgs/actions/set/saved.png`);

    await new Promise(resolve => setTimeout(resolve, 700));

    const snapshot = await imageSnapShot(cameraIP);
    await ev.action.setTitle(`chamar ${presetNumber}`);

    // Remove qualquer imagem antiga desse preset e adiciona a nova
    this.presetImages = this.presetImages.filter(p => p.numberPreset !== presetNumber);
    this.presetImages.push({
      numberPreset: presetNumber,
      image: snapshot
    });

    await ev.action.setImage(snapshot);
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent) {
    const settings = ev.payload.settings;
    const presetNumber = Number(settings.numberPreset);

    if (!isNaN(presetNumber)) {
      const found = this.presetImages.find(p => p.numberPreset === presetNumber);
      await ev.action.setImage(found ? found.image : "imgs/actions/preset/preset.png");
      await ev.action.setTitle(`chamar ${presetNumber}`);
    } else {
      await ev.action.setImage("imgs/actions/preset/preset.png");
      await ev.action.setTitle("Selecione");
    }
  }
}


