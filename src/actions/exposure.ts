import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent, type DidReceiveSettingsEvent } from "@elgato/streamdeck";
import { apiBasePtzPostImageValue } from "../utils/ptz-api-post-image-value";


export type PTZExposureProps = {
  typeExposure: "iris" | "shutter" | "gain" | "gainLimit" | "meter";
};

type PTZConfig = {
  iris: number;
  shutter: number;
  gain: number;
  gainLimit: number;
  meter: number;
};

// Não esquece de pegar a settings do html e relacioar no Manifest

@action({ UUID: "com.neoid.ptzneoid.aemode-exposure" })
export class AemodeExposure extends SingletonAction {

  static exposureLevel = 1;
  static readonly maxLevel = 10;
  static readonly minLevel = 1;
  private static readonly maxValues: PTZConfig = {
    iris: 12,
    shutter: 17,
    gain: 7,
    gainLimit: 15,
    meter: 3,
  };
  private static readonly levelBase = {
    iris: 3,
    shutter: 2,
    gain: 3,
    gainLimit: 6,
    meter: 0,
  };

    //KEYDOWN
  override async onKeyDown(ev: KeyDownEvent<PTZExposureProps>): Promise<void> {
    
    const tipo = ev.payload.settings.typeExposure;
    
    // Pega os valores globais atuais
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }


    if (!["iris", "shutter", "gain", "gainLimit", "meter"].includes(tipo)) {
      await ev.action.setTitle("Selecione");
      return;
    }

   


    let levelAtual = Number(globals[`${tipo}Level`] ?? AemodeExposure.levelBase[tipo]);
    let calculado;

    
    if(tipo === "iris"){
      if (isNaN(levelAtual) || levelAtual < 0 || levelAtual > 10) {
        levelAtual = 0;
      }

      levelAtual++;
      if (levelAtual > 10) levelAtual = 0;

      const maxValue = AemodeExposure.maxValues[tipo]; // 14, 200, 20
      calculado = Math.round((levelAtual / 10) * maxValue);

    } else if(tipo === "gain") {

      if (isNaN(levelAtual) || levelAtual < 0 || levelAtual > 7) {
        levelAtual = 0;
      }

      levelAtual++;
      if (levelAtual > 7) levelAtual = 0;

      //sem Calculo
      calculado = levelAtual

    } else if(tipo === "meter") {

      if (isNaN(levelAtual) || levelAtual < 0 || levelAtual > 3) {
        levelAtual = 0;
      }

      levelAtual++;
      if (levelAtual > 3) levelAtual = 0;

      //sem Calculo
      calculado = levelAtual

    } else {
      if (isNaN(levelAtual) || levelAtual < 1 || levelAtual > 10) {
        levelAtual = 1;
      }

      levelAtual++;
      if (levelAtual > 10) levelAtual = 1;

      const maxValue = AemodeExposure.maxValues[tipo]; // 14, 200, 20
      calculado = Math.round((levelAtual / 10) * maxValue);
    }
    

    //API CGI
    const apiBase = apiBasePtzPostImageValue(globals.cameraIP)
    const url = `${apiBase}&${tipo}&${calculado}`;
    const response = await fetch(url);

    if(response.ok){
      await ev.action.setImage(`imgs/actions/aemode-exposure/${tipo}`);
      await ev.action.setTitle(`${tipo}: ${levelAtual}`);


      if (tipo === "iris") {
        if(globals.aemodeIndex !== 2 && globals.aemodeIndex !== 4) {
          await ev.action.setTitle(`AE Mode\nprecisa ser\n (AAE, Manual)`);
          await ev.action.setImage("");
          return;
        }
        if(levelAtual === 0){
          await ev.action.setTitle(`Close`);
        } else {
          await ev.action.setTitle(`Iris: ${levelAtual}`);
        } 
      }

      if (tipo === "shutter") {
        if(globals.aemodeIndex !== 2 && globals.aemodeIndex !== 3) {
          await ev.action.setTitle(`AE Mode\nprecisa ser\n (SAE, Manual)`);
          await ev.action.setImage("");
          return;
        } 
        await ev.action.setTitle(`Shutter: ${levelAtual}`);
      }

      if (tipo === "gain") {
        if(globals.aemodeIndex !== 2) {
          await ev.action.setTitle(`AE Mode\nprecisa ser\n (Manual)`);
          await ev.action.setImage("");
          return;
        } 
        await ev.action.setTitle(`Gain: ${levelAtual}`);
      }

      if (tipo === "gainLimit") {
        if(globals.aemodeIndex !== 0 && globals.aemodeIndex !== 3 && globals.aemodeIndex !== 4 && globals.aemodeIndex !== 1) {
          await ev.action.setTitle(`AE Mode\nprecisa ser\n (Auto, SAE, AAE)`);
          await ev.action.setImage("");
          return;
        } 
        await ev.action.setTitle(`Gain Limit:\n${levelAtual}`);
      }

      if (tipo === "meter") {
        if(globals.aemodeIndex !== 0 && globals.aemodeIndex !== 3 && globals.aemodeIndex !== 4) {
          await ev.action.setTitle(`AE Mode\nprecisa ser\n (Auto, SAE, AAE)`);
          await ev.action.setImage("");
          return;
        } 

        if(calculado === 0) {
          await ev.action.setTitle(`Average`);
        } else if(calculado === 1){
          await ev.action.setTitle(`Center`);
        } else if(calculado === 2){
          await ev.action.setTitle(`smart`);
        }else if(calculado === 3){
          await ev.action.setTitle(`top`);
        }
      }

      await streamDeck.settings.setGlobalSettings({
        ...globals,
        [`${tipo}Level`]: levelAtual,
      });
    }
  }


  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PTZExposureProps>){
    const tipo = ev.payload.settings.typeExposure;

    // Pega os valores globais atuais
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP;
    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

    if (!["iris", "shutter", "gain", "gainLimit", "meter"].includes(tipo)) {
      await ev.action.setTitle("Selecione");
      return;
    }

    let levelGlobals = globals[`${tipo}Level`] === undefined ? "" : globals[`${tipo}Level`]

    
    await ev.action.setImage(`imgs/actions/aemode-exposure/${tipo}`);
    await ev.action.setTitle(`${tipo}: ${levelGlobals}`);


    if (tipo === "iris") {
      if(globals.aemodeIndex !== 2 && globals.aemodeIndex !== 4) {
        await ev.action.setTitle(`AE Mode\nprecisa ser\n (AAE, Manual)`);
        await ev.action.setImage("");
        return;
      } 
      if(levelGlobals === 0){
        await ev.action.setTitle(`Close`);
      } else {
        await ev.action.setTitle(`Iris: ${levelGlobals}`);
      } 
    }

    if (tipo === "shutter") {
      if(globals.aemodeIndex !== 2 && globals.aemodeIndex !== 3) {
        await ev.action.setTitle(`AE Mode\nprecisa ser\n (SAE, Manual)`);
        await ev.action.setImage("");
        return;
      } 
      await ev.action.setTitle(`Shutter: ${levelGlobals}`);
    }

    if (tipo === "gain") {
      if(globals.aemodeIndex !== 2) {
        await ev.action.setTitle(`AE Mode\nprecisa ser\n (Manual)`);
        await ev.action.setImage("");
        return;
      } 
      await ev.action.setTitle(`Gain: ${levelGlobals}`);
    }

    if (tipo === "gainLimit") {
      if(globals.aemodeIndex !== 0 && globals.aemodeIndex !== 3 && globals.aemodeIndex !== 4 && globals.aemodeIndex !== 1) {
        await ev.action.setTitle(`AE Mode\nprecisa ser\n (Auto, SAE, AAE)`);
        await ev.action.setImage("");
        return;
      } 
      await ev.action.setTitle(`Gain Limit:\n${levelGlobals}`);
    }

    if (tipo === "meter") {
      if(globals.aemodeIndex !== 0 && globals.aemodeIndex !== 3 && globals.aemodeIndex !== 4) {
        await ev.action.setTitle(`AE Mode\nprecisa ser\n (Auto, SAE, AAE)`);
        await ev.action.setImage("");
        return;
      } 

      if(levelGlobals === 0) {
        await ev.action.setTitle(`Average`);
      } else if(levelGlobals === 1){
        await ev.action.setTitle(`Center`);
      } else if(levelGlobals === 2){
        await ev.action.setTitle(`smart`);
      }else if(levelGlobals === 3){
        await ev.action.setTitle(`top`);
      }
    }
  }

  override async onWillAppear(ev: WillAppearEvent<PTZExposureProps>) {
    const tipo = ev.payload.settings.typeExposure;

    // Pega os valores globais atuais
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP;
    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

    if (!["iris", "shutter", "gain", "gainLimit", "meter"].includes(tipo)) {
      await ev.action.setTitle("Selecione");
      return;
    }


    let levelGlobals = globals[`${tipo}Level`] === undefined ? "" : globals[`${tipo}Level`]

    
    await ev.action.setImage(`imgs/actions/aemode-exposure/${tipo}`);
    await ev.action.setTitle(`${tipo}: ${levelGlobals}`);


    if (tipo === "iris") {
      if(globals.aemodeIndex !== 2 && globals.aemodeIndex !== 4) {
        await ev.action.setTitle(`AE Mode\nprecisa ser\n (AAE, Manual)`);
        await ev.action.setImage("");
        return;
      } 
      
      if(levelGlobals === 0){
        await ev.action.setTitle(`Close`);
      } else {
        await ev.action.setTitle(`Iris: ${levelGlobals}`);
      }
    }

    if (tipo === "shutter") {
      if(globals.aemodeIndex !== 2 && globals.aemodeIndex !== 3) {
        await ev.action.setTitle(`AE Mode\nprecisa ser\n (SAE, Manual)`);
        await ev.action.setImage("");
        return;
      } 
      await ev.action.setTitle(`Shutter: ${levelGlobals}`);
    }

    if (tipo === "gain") {
      if(globals.aemodeIndex !== 2) {
        await ev.action.setTitle(`AE Mode\nprecisa ser\n (Manual)`);
        await ev.action.setImage("");
        return;
      } 
      await ev.action.setTitle(`Gain: ${levelGlobals}`);
    }

    if (tipo === "gainLimit") {
      if(globals.aemodeIndex !== 0 && globals.aemodeIndex !== 3 && globals.aemodeIndex !== 4 && globals.aemodeIndex !== 1) {
        await ev.action.setTitle(`AE Mode\nprecisa ser\n (Auto, SAE, AAE)`);
        await ev.action.setImage("");
        return;
      } 
      await ev.action.setTitle(`Gain Limit:\n${levelGlobals}`);
    }

    if (tipo === "meter") {
      if(globals.aemodeIndex !== 0 && globals.aemodeIndex !== 3 && globals.aemodeIndex !== 4) {
        await ev.action.setTitle(`AE Mode\nprecisa ser\n (Auto, SAE, AAE)`);
        await ev.action.setImage("");
        return;
      } 

      if(levelGlobals === 0) {
        await ev.action.setTitle(`Average`);
      } else if(levelGlobals === 1){
        await ev.action.setTitle(`Center`);
      } else if(levelGlobals === 2){
        await ev.action.setTitle(`smart`);
      }else if(levelGlobals === 3){
        await ev.action.setTitle(`top`);
      }
    }
  }
}

