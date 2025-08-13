import streamDeck, { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { apiBasePtzPostImageValue } from "../utils/ptz-api-post-image-value";

interface WbModeProps {
  value: number;
  name: string;
}

// Array de modos WB
const wbModes: WbModeProps[] = [
  { value: 0, name: "Auto" },
  { value: 4, name: "Indoor" },
  { value: 5, name: "Outdoor" },
  { value: 1, name: "Manual" },
  { value: 3, name: "VAR" },
  { value: 2, name: "OnePush" },
];

let currentWbIndex = 0; // Começa no Auto

const getNextWbIndex = () => (currentWbIndex + 1) % wbModes.length;

@action({ UUID: "com.neoid.ptzneoid.wbmode" })
export class WbMode extends SingletonAction{

  override async onKeyDown(ev: KeyDownEvent) {
    /// Pega o próximo índice
    currentWbIndex = getNextWbIndex();
    const mode = wbModes[currentWbIndex];

    // Chama a URL da câmera
    const cameraIp = "192.168.100.88"; // substitua pelo IP da sua câmera
    const url = `http://${cameraIp}/cgi-bin/ptzctrl.cgi?post_image_value&wbmode&${mode.value}`;

    ev.action.setTitle( `${mode.name}: ${mode.value}`);
    
    await fetch(url);
      
  }
}