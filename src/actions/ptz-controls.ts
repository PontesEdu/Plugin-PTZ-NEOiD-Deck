import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { apiBaseCMD } from "../utils/ptz-api-base";

export type PtzSettings = {
  speed?: number;
  tilt?: number;
  direction: string;
  cameraIP: any;
};


//MOVE
async function move(settings: PtzSettings, globals: any) {

  const apiBase = apiBaseCMD(globals.cameraIP)

  const speed = globals.panSpeed ;
  const direction = settings.direction ?? '';
  const url = `${apiBase}&${direction}&${speed}&${speed}`;
  console.log(`Move: ${url}`);
  await fetch(url);
}

//STOP
async function stop(cameraIP: any) {

  const apiBase = apiBaseCMD(cameraIP)

  const url = `${apiBase}&ptzstop&0&0`;
  console.log(`Stop: ${url}`);
  await fetch(url);
}

// Ações
@action({ UUID: "ptz.control" })
export class PTZControl extends SingletonAction<PtzSettings> {


  override async onWillAppear(ev: WillAppearEvent<PtzSettings>) {
    const globals = await streamDeck.settings.getGlobalSettings();
    const settings = ev.payload.settings;
    
    ev.action.setImage(`imgs/actions/controls/${settings.direction}.png`)

    const cameraIP = globals.cameraIP

    if(!cameraIP){
      ev.action.setTitle(`Sem Camera`)
      return;
    }
    ev.action.setTitle('')
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PtzSettings>){
    const settings = ev.payload.settings
    ev.action.setImage(`imgs/actions/controls/${settings.direction}.png`)

    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP

    if(!cameraIP){
      ev.action.setTitle(`Sem Camera`)
      return;
    }

    ev.action.setTitle('')

    await streamDeck.settings.getGlobalSettings();
  }


  override async onKeyDown(ev: KeyDownEvent<PtzSettings>): Promise<void> {
    const settings = ev.payload.settings
    ev.action.setImage(`imgs/actions/controls/${settings.direction}.png`)

    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP

    if(!cameraIP){
      ev.action.setTitle(`Sem Camera`)
      return;
    }

    await move(settings, globals);
  }

  override async onKeyUp(ev: KeyUpEvent<PtzSettings>): Promise<void> {
    //configuraçoes globais que estao vindo de outro
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP
    if(cameraIP){
      await stop(cameraIP);
    } else{
      ev.action.setTitle(`Sem Camera`)
    }
  }
}

