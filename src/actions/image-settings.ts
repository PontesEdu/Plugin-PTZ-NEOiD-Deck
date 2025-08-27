import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent, type DidReceiveSettingsEvent } from "@elgato/streamdeck";
import { apiBasePtzPostImageValue } from "../utils/ptz-api-post-image-value";


export type PTZImageProps = {
  imageSettings: "contrast" | "luminance" | "sharpness";
};

type PTZConfig = {
  contrast: number;
  luminance: number;
  sharpness: number;
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
  };
  private static readonly levelBase = {
    contrast: 4,
    luminance: 4,
    sharpness: 0,
  };

    //KEYDOWN
  override async onKeyDown(ev: KeyDownEvent<PTZImageProps>): Promise<void> {
    
    const tipo = ev.payload.settings.imageSettings;

    if (!["contrast", "luminance", "sharpness"].includes(tipo)) {
      await ev.action.setTitle("Selecione");
      return;
    }

    // Pega os valores globais atuais
    const globals = await streamDeck.settings.getGlobalSettings();


    let levelAtual = Number(globals[`${tipo}Level`] ?? ImageSettings.levelBase[tipo]);
    let calculado;

    if(tipo === "sharpness"){

      if (isNaN(levelAtual) || levelAtual < 0 || levelAtual > 14) {
        levelAtual = 0; 
      }

      levelAtual++;
      if (levelAtual > 14) levelAtual = 0;

      calculado = levelAtual

    } else {
      if (isNaN(levelAtual) || levelAtual < 0 || levelAtual > 10) {
      levelAtual = 0;
      }

      levelAtual++;
      if (levelAtual > 10) levelAtual = 0;

      const maxValue = ImageSettings.maxValues[tipo]; // 14, 200, 20
      calculado = Math.round((levelAtual / 10) * maxValue);
    
    }
    
    const apiBase = apiBasePtzPostImageValue(globals.cameraIP)
    let response;

    if(tipo === "sharpness"){
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
      }
    }

    
    const url = `${apiBase}&${tipo}&${calculado}`;
    response = await fetch(url);
    

    if(response.ok){
      await ev.action.setImage(`imgs/actions/image-settings/${tipo}`);
      await ev.action.setTitle(`${tipo}: ${levelAtual}`);

      if (tipo === "luminance") {
        await ev.action.setTitle(`Luminance:\n${levelAtual}`);
      }

      if(tipo === "sharpness"){
        await ev.action.setTitle(`sharpness:\n${levelAtual}`);
      }

      await streamDeck.settings.setGlobalSettings({
        ...globals,
        [`${tipo}Level`]: levelAtual,
      });
    }
  }


  // override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PTZImageProps>){
  //   const settings = ev.payload.settings;

  //   const tipo = settings.imageSettings;

  //   if (!["contrast", "luminance", "gain", "gainlimit", "meter"].includes(tipo)) {
  //     await ev.action.setTitle("Selecione");
  //     return;
  //   }

  //   // Pega os valores globais atuais
  //   const globals = await streamDeck.settings.getGlobalSettings();

  //   //verifica se é undefined
  //   let levelGlobals = globals[`${tipo}Level`] === undefined ? "" : globals[`${tipo}Level`]

  //   // Atualiza o título do botão
  //   await ev.action.setImage(`imgs/actions/aemode-image/${tipo}`);
  //   await ev.action.setTitle(`${tipo}: ${levelGlobals}`);

  //   if (tipo === 'luminance') {
  //     await ev.action.setTitle(`${tipo}:\n${levelGlobals}%`);
  //   }

  //   if (tipo === "gain") {
  //     await ev.action.setTitle(`RG tuning:\n${levelGlobals}`);
  //   }

  //   if (tipo === "gainlimit") {
  //     await ev.action.setTitle(`BG tuning:\n${levelGlobals}`);
  //   }

  //   if (tipo === "meter") {
  //     if(globals.aemodeIndex !== 4){
  //       await ev.action.setTitle(`WB Mode\nprecisa ser\nVAR`);
  //       await ev.action.setImage("");
  //       return;
  //     } 
  //     await ev.action.setTitle(`Temp:\n ${levelGlobals}00K`);
  //   }
  // }

  // override async onWillAppear(ev: WillAppearEvent<PTZImageProps>) {
  //   const settings = ev.payload.settings;
  //   // Pega os valores globais atuais
  //   const globals = await streamDeck.settings.getGlobalSettings();

  //   const tipo = settings.imageSettings;

  //   if (!["contrast", "luminance", "gain", "gainlimit", "meter"].includes(tipo)) {
  //     await ev.action.setTitle("Selecione");
  //     return;
  //   }

  //   let levelGlobals = globals[`${tipo}Level`] === undefined ? "" : globals[`${tipo}Level`]

  //   await ev.action.setImage(`imgs/actions/aemode-image/${tipo}`);
  //   await ev.action.setTitle(`${tipo}: ${levelGlobals}`);

  //   if (tipo === 'luminance') {
  //     await ev.action.setTitle(`${tipo}:\n${levelGlobals}%`);
  //   }

  //   if (tipo === "gain") {
  //     await ev.action.setTitle(`RG tuning:\n${levelGlobals}`);
  //   }

  //   if (tipo === "gainlimit") {
  //     await ev.action.setTitle(`BG tuning:\n${levelGlobals}`);
  //   }

  //   if (tipo === "meter") {
  //     if(globals.aemodeIndex !== 4){
  //       await ev.action.setTitle(`WB Mode\nprecisa ser\nVAR`);
  //       await ev.action.setImage("");
  //       return;
  //     } 
  //     await ev.action.setTitle(`Temp:\n ${levelGlobals}00K`);
  //   }
  // }
}

