import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent, type DidReceiveSettingsEvent } from "@elgato/streamdeck";
import { apiBasePtzPostImageValue } from "../utils/ptz-api-post-image-value";


export type PTZImageProps = {
  imageSettings: "contrast" | "luminance" | "sharpness" | "flipH" | "flipV";
};

type PTZConfig = {
  contrast: number;
  luminance: number;
  sharpness: number;
  flipH: number;
  flipV: number;
};

// Não esquece de pegar a settings do html e relacioar no Manifest

@action({ UUID: "com.neoid.ptzneoid.image-settings" })
export class ImageSettings extends SingletonAction {

  static imageLevel = 1;
  static readonly maxLevel = 10;
  static readonly minLevel = 1;
  private static readonly maxValues: PTZConfig = {
    contrast: 14,
    luminance: 14,
    sharpness: 14,
    flipH: 1,
    flipV: 1,
  };
  private static readonly levelBase = {
    contrast: 4,
    luminance: 5,
    sharpness: 0,
    flipH: 0,
    flipV: 0,
  };

    //KEYDOWN
  override async onKeyDown(ev: KeyDownEvent<PTZImageProps>): Promise<void> {
    
    const tipo = ev.payload.settings.imageSettings;
    // Pega os valores globais atuais
    const globals = await streamDeck.settings.getGlobalSettings();


    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }


    if (!["contrast", "luminance", "sharpness", "flipH", "flipV"].includes(tipo)) {
      await ev.action.setTitle("Selecione");
      return;
    }

    


    let levelAtual = Number(globals[`${tipo}Level`] ?? ImageSettings.levelBase[tipo]);
    let calculado;

    const apiBase = apiBasePtzPostImageValue(globals.cameraIP)
    let response;

    if(tipo === "flipV") {
      if (isNaN(levelAtual) || levelAtual < 0 || levelAtual > 1) {
        levelAtual = 0; 
      }

      levelAtual++;
      if (levelAtual > 1) levelAtual = 0;

      calculado = levelAtual

    } else if(tipo === "flipH") {

      if (isNaN(levelAtual) || levelAtual < 0 || levelAtual > 1) {
        levelAtual = 0; 
      }

      levelAtual++;
      if (levelAtual > 1) levelAtual = 0;

      calculado = levelAtual

    } else if(tipo === "sharpness") {
      if (isNaN(levelAtual) || levelAtual < 0 || levelAtual > 14) {
        levelAtual = 0; 
      }

      levelAtual++;
      if (levelAtual > 14) levelAtual = 0;

      calculado = levelAtual

      if(levelAtual === 0) {
        // Auto
        const urlMode = `${apiBase}&sharpness_mode&0`;
        response = await fetch(urlMode);

        if(response.ok){
          await ev.action.setTitle(`sharpness:\nAUTO`);
          await ev.action.setImage(`imgs/actions/image-settings/${tipo}`);
        }

        await streamDeck.settings.setGlobalSettings({
          ...globals,
          [`${tipo}Level`]: levelAtual,
        });

        return;
      } else {
        //Manual
        const urlMode = `${apiBase}&sharpness_mode&1`;
        await fetch(urlMode);
        await ev.action.setTitle(`sharpness:\n${levelAtual}`);
      }

    } else {
      if (isNaN(levelAtual) || levelAtual < 0 || levelAtual > 10) {
      levelAtual = 0;
      }

      levelAtual++;
      if (levelAtual > 10) levelAtual = 0;

      const maxValue = ImageSettings.maxValues[tipo]; // 14, 200, 20
      calculado = Math.round((levelAtual / 10) * maxValue);
    
    }
    
    
    const url = `${apiBase}&${tipo}&${calculado}`;
    response = await fetch(url);
    

    if(response.ok){
      await ev.action.setImage(`imgs/actions/image-settings/${tipo}`);
      await ev.action.setTitle(`${tipo}:\n${levelAtual}`);

      if(tipo === "flipV") {

        if(levelAtual === 0) {
          await ev.action.setTitle(`${tipo}: off`);
        } else {
          await ev.action.setTitle(`${tipo}: on`);
        }
        
      } 

      if(tipo === "flipH") {
        if(levelAtual === 0) {
          await ev.action.setTitle(`${tipo}: off`);
        } else {
          await ev.action.setTitle(`${tipo}: on`);
        }
      } 

      await streamDeck.settings.setGlobalSettings({
        ...globals,
        [`${tipo}Level`]: levelAtual,
      });
    }
  }


  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PTZImageProps>){
    const settings = ev.payload.settings;

    const tipo = settings.imageSettings;

    // Pega os valores globais atuais
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP;
    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

    if (!["contrast", "luminance", "sharpness", "flipH", "flipV"].includes(tipo)) {
      await ev.action.setTitle("Selecione");
      return;
    }

    

    //verifica se é undefined
    let levelGlobals = globals[`${tipo}Level`] === undefined ? "" : globals[`${tipo}Level`]

    // Atualiza o título do botão
    await ev.action.setImage(`imgs/actions/image-settings/${tipo}`);
    await ev.action.setTitle(`${tipo}:\n${levelGlobals}`);

    if(tipo === "flipV") {
      if(levelGlobals === 0) {
        await ev.action.setTitle(`${tipo}: off`);
      } else {
        await ev.action.setTitle(`${tipo}: on`);
      } 
    } 

    if(tipo === "flipH") {
      if(levelGlobals === 0) {
        await ev.action.setTitle(`${tipo}: off`);
      } else {
        await ev.action.setTitle(`${tipo}: on`);
      }
    } 

    if(tipo === "sharpness") {
      if(levelGlobals === 0) {
        // Auto
        await ev.action.setTitle(`sharpness:\nAUTO`);
      } else {
        //Manual
        await ev.action.setTitle(`sharpness:\n${levelGlobals}`);
      }
    }

    
  }

  override async onWillAppear(ev: WillAppearEvent<PTZImageProps>) {
    const settings = ev.payload.settings;
    
    // Pega os valores globais atuais
    const globals = await streamDeck.settings.getGlobalSettings();


    const cameraIP = globals.cameraIP;
    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

    const tipo = settings.imageSettings;

    if (!["contrast", "luminance", "sharpness", "flipH", "flipV"].includes(tipo)) {
      await ev.action.setTitle("Selecione");
      return;
    }

    let levelGlobals = globals[`${tipo}Level`] === undefined ? "" : globals[`${tipo}Level`]

    await ev.action.setImage(`imgs/actions/image-settings/${tipo}`);
    await ev.action.setTitle(`${tipo}:\n${levelGlobals}`);

    if(tipo === "flipV") {
      if(levelGlobals === 0) {
        await ev.action.setTitle(`${tipo}: off`);
      } else {
        await ev.action.setTitle(`${tipo}: on`);
      } 
    } 

    if(tipo === "flipH") {
      if(levelGlobals === 0) {
        await ev.action.setTitle(`${tipo}: off`);
      } else {
        await ev.action.setTitle(`${tipo}: on`);
      }
    } 

    if(tipo === "sharpness") {
      if(levelGlobals === 0) {
        // Auto
        await ev.action.setTitle(`sharpness:\nAUTO`);
      } else {
        //Manual
        await ev.action.setTitle(`sharpness:\n${levelGlobals}`);
      }
    }
  }
}

