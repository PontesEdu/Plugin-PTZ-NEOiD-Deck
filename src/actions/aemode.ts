import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { apiBasePtzPostImageValue } from "../utils/ptz-api-post-image-value";

interface AemodeProps {
  value: number;
  name: string;
}

const aemodes: AemodeProps[] = [
  { value: 0, name: "Auto" },
  { value: 3, name: "Bright" },
  { value: 1, name: "Manual" },
  { value: 4, name: "SAE" },
  { value: 2, name: "AAE" },
];

let currentWbIndex = 0; // valor temporário em runtime

const getNextWbIndex = () => (currentWbIndex + 1) % aemodes.length;

@action({ UUID: "com.neoid.ptzneoid.aemode" })
export class Aemode extends SingletonAction {

  // Carrega valor salvo ao aparecer na tela
  override async onWillAppear(ev: WillAppearEvent) {
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP
    
    if(!cameraIP){
      ev.action.setTitle(`Sem Camera`)
      return;
    }

    const savedIndex = globals?.aemodeIndex;

    if (typeof savedIndex === "number" && savedIndex >= 0 && savedIndex < aemodes.length) {
      currentWbIndex = savedIndex;
    } else {
      currentWbIndex = 0; // fallback para "Auto"
    }

    // Atualiza o título no botão
    ev.action.setTitle(aemodes[currentWbIndex].name);
  }

  // Quando usuário pressiona a tecla
  override async onKeyDown(ev: KeyDownEvent) {
    currentWbIndex = getNextWbIndex();
    const mode = aemodes[currentWbIndex];

    // Salva no Global Settings
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP
    

    if(!cameraIP){
      ev.action.setTitle(`Sem Camera`)
      return;
    }

    // Atualiza título
    ev.action.setTitle(mode.name);

    // Envia comando para a câmera
    const url = `http://${cameraIP}/cgi-bin/ptzctrl.cgi?post_image_value&aemode&${mode.value}`;
    const res = await fetch(url);

    if(res.ok){
      await streamDeck.settings.setGlobalSettings({
        ...globals,
        aemodeIndex: currentWbIndex,
      });
    }
  }
  
  // Caso configuração global mude em outro lugar
  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent) {
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP
    
    if(!cameraIP){
      ev.action.setTitle(`Sem Camera`)
      return;
    }

    const savedIndex = globals?.aemodeIndex;

    if (typeof savedIndex === "number" && savedIndex >= 0 && savedIndex < aemodes.length) {
      currentWbIndex = savedIndex;
      ev.action.setTitle(aemodes[currentWbIndex].name);
    }
  }
}
