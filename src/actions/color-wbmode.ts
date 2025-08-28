import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent, type DidReceiveSettingsEvent } from "@elgato/streamdeck";
import { apiBasePtzPostImageValue } from "../utils/ptz-api-post-image-value";


export type PTZColorProps = {
  colorSettings: "hue" | "saturation" | "rgaintuning" | "bgaintuning" | "colortemp";
};

type PTZConfig = {
  hue: number;
  saturation: number;
  rgaintuning: number;
  bgaintuning: number;
  colortemp: number,
};

// Não esquece de pegar a settings do html e relacioar no Manifest

@action({ UUID: "com.neoid.ptzneoid.wbmodecolor" })
export class WbModeColor extends SingletonAction {

  static colorLevel = 1;
  static readonly maxLevel = 10;
  static readonly minLevel = 1;
  private static readonly maxValues: PTZConfig = {
    hue: 14,
    saturation: 200,
    rgaintuning: 20,
    bgaintuning: 20,
    colortemp: 80,
  };
  private static readonly levelBase = {
    hue: 6,
    saturation: 60,
    rgaintuning: 4,
    bgaintuning: 4,
    colortemp: 65,
  };


    //KEYDOWN
  override async onKeyDown(ev: KeyDownEvent<PTZColorProps>): Promise<void> {
    
    const settings = ev.payload.settings;
    const tipo = settings.colorSettings;

    // Pega os valores globais atuais
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

    if (!["hue", "saturation", "rgaintuning", "bgaintuning", "colortemp"].includes(tipo)) {
      await ev.action.setTitle("Selecione");
      return;
    }

    // Converte o level atual para número (com fallback para 1)
    let levelAtual = Number(globals[`${tipo}Level`] ?? WbModeColor.levelBase[tipo]);
    let calculado;

    if(tipo === "saturation"){
      if (isNaN(levelAtual) || levelAtual < 60 || levelAtual > 200) {
        levelAtual = 60;
      }

      levelAtual = levelAtual + 10;
      if (levelAtual > 200) levelAtual = 60;

      calculado = levelAtual

    } else if(tipo === "colortemp") {
      if (isNaN(levelAtual) || levelAtual < 25 || levelAtual > 85) {
        levelAtual = 25;
      }

      levelAtual++;
      if (levelAtual > 85) levelAtual = 25;

      calculado = levelAtual

    } else {
      if (isNaN(levelAtual) || levelAtual < 1 || levelAtual > 10) {
        levelAtual = 1;
      }

      levelAtual++;
      if (levelAtual > 10) levelAtual = 1;

      const maxValue = WbModeColor.maxValues[tipo]; // 14, 200, 20
      calculado = Math.round((levelAtual / 10) * maxValue);
    }
    
    // Calcula a velocidade com base no level
    

    //API CGI
    const apiBase = apiBasePtzPostImageValue(globals.cameraIP)
    const url = `${apiBase}&${tipo}&${calculado}`;
    const response = await fetch(url);

    if(response.ok){
      await ev.action.setImage(`imgs/actions/wbmode-color/${tipo}`);
      await ev.action.setTitle(`${tipo}: ${levelAtual}`);

      if (tipo === 'saturation') {
        await ev.action.setTitle(`${tipo}:\n${levelAtual}%`);
      }

      if (tipo === "rgaintuning") {
        await ev.action.setTitle(`RG tuning:\n${levelAtual}`);
      }

      if (tipo === "bgaintuning") {
        await ev.action.setTitle(`BG tuning:\n${levelAtual}`);
      }

      if (tipo === "colortemp") {
        if(globals.wbModeIndex !== 4){
          await ev.action.setTitle(`WB Mode\nprecisa ser\nVAR`);
          await ev.action.setImage("");
          return;
        } 
        await ev.action.setTitle(`Temp:\n ${levelAtual}00K`);
      }

      await streamDeck.settings.setGlobalSettings({
        ...globals,
        [`${tipo}Level`]: levelAtual,
      });
    }
  }


  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PTZColorProps>){
    const settings = ev.payload.settings;

    const tipo = settings.colorSettings;

    // Pega os valores globais atuais
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP;
    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

    if (!["hue", "saturation", "rgaintuning", "bgaintuning", "colortemp"].includes(tipo)) {
      await ev.action.setTitle("Selecione");
      return;
    }

    //verifica se é undefined
    let levelGlobals = globals[`${tipo}Level`] === undefined ? "" : globals[`${tipo}Level`]

    // Atualiza o título do botão
    await ev.action.setImage(`imgs/actions/wbmode-color/${tipo}`);
    await ev.action.setTitle(`${tipo}: ${levelGlobals}`);

    if (tipo === 'saturation') {
      await ev.action.setTitle(`${tipo}:\n${levelGlobals}%`);
    }

    if (tipo === "rgaintuning") {
      await ev.action.setTitle(`RG tuning:\n${levelGlobals}`);
    }

    if (tipo === "bgaintuning") {
      await ev.action.setTitle(`BG tuning:\n${levelGlobals}`);
    }

    if (tipo === "colortemp") {
      if(globals.wbModeIndex !== 4){
        await ev.action.setTitle(`WB Mode\nprecisa ser\nVAR`);
        await ev.action.setImage("");
        return;
      } 
      await ev.action.setTitle(`Temp:\n ${levelGlobals}00K`);
    }
  }

  override async onWillAppear(ev: WillAppearEvent<PTZColorProps>) {
    const settings = ev.payload.settings;

    // Pega os valores globais atuais
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP;
    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

    const tipo = settings.colorSettings;

    if (!["hue", "saturation", "rgaintuning", "bgaintuning", "colortemp"].includes(tipo)) {
      await ev.action.setTitle("Selecione");
      return;
    }

    let levelGlobals = globals[`${tipo}Level`] === undefined ? "" : globals[`${tipo}Level`]

    await ev.action.setImage(`imgs/actions/wbmode-color/${tipo}`);
    await ev.action.setTitle(`${tipo}: ${levelGlobals}`);

    if (tipo === 'saturation') {
      await ev.action.setTitle(`${tipo}:\n${levelGlobals}%`);
    }

    if (tipo === "rgaintuning") {
      await ev.action.setTitle(`RG tuning:\n${levelGlobals}`);
    }

    if (tipo === "bgaintuning") {
      await ev.action.setTitle(`BG tuning:\n${levelGlobals}`);
    }

    if (tipo === "colortemp") {
      if(globals.wbModeIndex !== 4){
        await ev.action.setTitle(`WB Mode\nprecisa ser\nVAR`);
        await ev.action.setImage("");
        return;
      } 
      await ev.action.setTitle(`Temp:\n ${levelGlobals}00K`);
    }
  }
}

