import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { apiBaseCMD } from "../utils/ptz-api-base";
import { checkCameraConnection } from "./ptz-register";

export type PtzSettings = {
  speed?: number;
  tilt?: number;
  direction: string;
  cameraIP: any;
  camera: any;
  cameraIPControls: string
};



// Ações
@action({ UUID: "com.neoid.ptzneoid.ptz-controls" })
export class PTZControl extends SingletonAction<PtzSettings> {


  override async onWillAppear(ev: WillAppearEvent<PtzSettings>) {
    const settings = ev.payload.settings
    const globals = await streamDeck.settings.getGlobalSettings();
    ev.action.setImage(`imgs/actions/controls/${settings.direction}.png`)

    let cameraIP; // começa como true

    if(!globals.cameraIP) {

      const cameraIPControls = settings.cameraIPControls === undefined ? false : settings.cameraIPControls

      const checkCamera = await checkCameraConnection(`${cameraIPControls}`, 1000)

      if(checkCamera){
        cameraIP = cameraIPControls

        await streamDeck.settings.setGlobalSettings({
          ...globals,
          cameraIP: cameraIPControls,
        });

        // await ev.action.setSettings({...settings, cameraIPControls: cameraIPControls});
      }

    } else {
      await ev.action.setSettings({...settings, cameraIPControls: globals.cameraIP});
      cameraIP = globals.cameraIP
    }


    // verificando o Nome que vai aparecer
    const titleName = globals.camera === undefined ? "" : globals.camera as string
    await ev.action.setTitle(`${titleName}`)
    if (["no camera"].includes(titleName)) {
      await ev.action.setTitle("");
    }
    
    // Verificando a direção
    const direction = settings.direction;
    if (!["up", "down", "left", "right", "leftup", "leftdown", "rightup", "home", "rightdown"].includes(direction)) {
      await ev.action.setTitle("Selecione");
      return;
    }
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent){
    // SETTINGS
    const settings = ev.payload.settings
    const globals = await streamDeck.settings.getGlobalSettings();

    ev.action.setImage(`imgs/actions/controls/${settings.direction}.png`) 

    const titleName = globals.camera === undefined ? "" : globals.camera as string
    await ev.action.setTitle(`${titleName}`)
    if (["no camera"].includes(titleName)) {
      await ev.action.setTitle("");
    }

    const direction = settings.direction as string;
    if (!["up", "down", "left", "right", "leftup", "leftdown", "rightup", "home", "rightdown"].includes(direction)) {
      await ev.action.setTitle("Selecione");
      return;
    }


  }


  override async onKeyDown(ev: KeyDownEvent<PtzSettings>): Promise<void> {
    const settings = ev.payload.settings
    const globals = await streamDeck.settings.getGlobalSettings();
    ev.action.setImage(`imgs/actions/controls/${settings.direction}.png`)

    let cameraIP; // começa como true

    if(!globals.cameraIP) {

      const cameraIPControls = settings.cameraIPControls === undefined ? false : settings.cameraIPControls

      const checkCamera = await checkCameraConnection(`${cameraIPControls}`, 1000)

      if(checkCamera){
        cameraIP = cameraIPControls

        await streamDeck.settings.setGlobalSettings({
          ...globals,
          cameraIP: cameraIPControls,
        });
      }

      // await ev.action.setSettings({...settings, cameraIPControls: cameraIPControls});

    } else {
      await ev.action.setSettings({...settings, cameraIPControls: globals.cameraIP});
      cameraIP = globals.cameraIP
    }


    // verificando o Nome que vai aparecer
    const titleName = globals.camera === undefined ? "" : globals.camera as string
    await ev.action.setTitle(`${titleName}`)
    if (["no camera"].includes(titleName)) {
      await ev.action.setTitle("");
    }
    
    // Verificando a direção
    const direction = settings.direction;
    if (!["up", "down", "left", "right", "leftup", "leftdown", "rightup", "home", "rightdown"].includes(direction)) {
      await ev.action.setTitle("Selecione");
      return;
    }
    
    //API CGI
    const apiBase = apiBaseCMD(cameraIP);

    const speed = globals.panSpeed;
    
    const url = `${apiBase}&${direction}&${speed}&${speed}`;
    const response = await fetch(url);  

    if (!response.ok) {
      await ev.action.setTitle("");
      await ev.action.setImage(`imgs/actions/error.png`);
    }
    
  }
  

  override async onKeyUp(ev: KeyUpEvent<PtzSettings>): Promise<void> {
    //configuraçoes globais que estao vindo de outro
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP

    const apiBase = apiBaseCMD(cameraIP)
    const url = `${apiBase}&ptzstop&0&0`;
    await fetch(url);  
  }
}

