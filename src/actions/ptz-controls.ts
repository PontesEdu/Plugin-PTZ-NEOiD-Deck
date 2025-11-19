import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, PropertyInspectorDidAppearEvent, PropertyInspectorDidDisappearEvent, SingletonAction, TitleParametersDidChangeEvent, WillAppearEvent } from "@elgato/streamdeck";
import { apiBaseCMD } from "../utils/ptz-api-base";
import { checkCameraConnection } from "../utils/checkCameraConnection";

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
export class PTZControls extends SingletonAction<PtzSettings> {

  override async onWillAppear(ev: WillAppearEvent<PtzSettings>) {
    const settings = ev.payload.settings
    const globals = await streamDeck.settings.getGlobalSettings();
    ev.action.setImage(`imgs/actions/controls/${settings.direction}.png`)
    
    const cameraIPControls = settings.cameraIPControls === undefined ? false : settings.cameraIPControls

    if(!globals.cameraIP) {
      const checkCamera = await checkCameraConnection(`${cameraIPControls}`, 1000)

      if(checkCamera){
        // para quando adicionar um camera select novo ele ja mosntar com o cameraIP Default
        await streamDeck.settings.setGlobalSettings({
          ...globals,
          cameraIPControls: cameraIPControls,
        });
      }
    }
    
    await ev.action.setSettings({...settings, cameraIPControls: globals.cameraIPControls});
    
    const titleName = globals.camera === undefined ? "" : globals.camera as string
    await ev.action.setTitle(`${titleName.includes("No camera") ? "default" : titleName }`)

    // Verificando a direção
    const direction = settings.direction;
    if (!["up", "down", "left", "right", "leftup", "leftdown", "rightup", "home", "rightdown"].includes(direction)) {
      await ev.action.setTitle("Select");
      return;
    }
  }


  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent){
    // SETTINGS
    const settings = ev.payload.settings
    const globals = await streamDeck.settings.getGlobalSettings();

    ev.action.setImage(`imgs/actions/controls/${settings.direction}.png`)

    const direction = settings.direction as string;
    if (!["up", "down", "left", "right", "leftup", "leftdown", "rightup", "home", "rightdown"].includes(direction)) {
      await ev.action.setTitle("Select");
      return;
    }

    const titleName = globals.camera === undefined ? "" : globals.camera as string
    this.actions.forEach(async (action) => {
      action.setTitle(`${titleName.includes("No camera") ? "default" : titleName }`)
    });
  }


  override async onPropertyInspectorDidAppear(ev: PropertyInspectorDidAppearEvent) {
    // Esse método é chamado quando o user abre o inspector de propriedades/config (abre o botão)
    const globals = await streamDeck.settings.getGlobalSettings();
    const settings = await ev.action.getSettings();

    await ev.action.setSettings({...settings, cameraIPControls: globals.cameraIPControls});
  }

  override async onPropertyInspectorDidDisappear(ev: PropertyInspectorDidDisappearEvent) {
    // Esse método é chamado quando o user abre o inspector de propriedades/config (abre o botão)
    const globals = await streamDeck.settings.getGlobalSettings();
    const settings = await ev.action.getSettings();

    const cameraIPControls = settings.cameraIPControls === undefined ? false : settings.cameraIPControls

    await streamDeck.settings.setGlobalSettings({
      ...globals,
      cameraIP: cameraIPControls,
      cameraIPControls: cameraIPControls,
    });
  }

  override async onKeyDown(ev: KeyDownEvent<PtzSettings>): Promise<void> {
    const settings = ev.payload.settings
    const globals = await streamDeck.settings.getGlobalSettings();

    let cameraIP;
    
    const cameraIPControls = settings.cameraIPControls === undefined ? false : settings.cameraIPControls
    
    if(!globals.cameraIP) {
      const checkCamera = await checkCameraConnection(`${cameraIPControls}`, 1000)

      if(checkCamera){
        cameraIP = cameraIPControls

        // para quando adicionar um camera select novo ele ja mosntar com o cameraIP Default
        await streamDeck.settings.setGlobalSettings({
          ...globals,
          cameraIP: cameraIPControls,
          cameraIPControls: cameraIPControls,
        });
      }
      
    } else {
      // na hora que voce adicionar o camera IP default ele não vai passar por la mais
      cameraIP = globals.cameraIP
    }
    
    await ev.action.setSettings({...settings, cameraIPControls: globals.cameraIPControls});

    cameraIPControls
    
    const titleName = globals.camera === undefined ? "" : globals.camera as string
    this.actions.forEach(action => {
      action.setTitle(`${titleName.includes("No camera") ? "default" : titleName}`)
    })

    // Verificando a direção
    const direction = settings.direction;
    if (!["up", "down", "left", "right", "leftup", "leftdown", "rightup", "home", "rightdown"].includes(direction)) {
      await ev.action.setTitle("Select");
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

    //API CGI
    const apiBase = apiBaseCMD(cameraIP)
    const url = `${apiBase}&ptzstop&0&0`;
    await fetch(url);  
  }
}
