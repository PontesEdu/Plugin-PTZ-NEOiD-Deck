import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { apiBaseCMD } from "../utils/ptz-api-base";

export type PtzFocus = {
  speed?: number;
  mode: "focusout" | "focusin" | "afocus";
  cameraIP: any;
  camera: string;
};


// Ações
@action({ UUID: "com.neoid.ptzneoid.ptz-focus" })
export class PTZFocus extends SingletonAction<PtzFocus> {

  override async onWillAppear(ev: WillAppearEvent<PtzFocus>) {
    const settings = ev.payload.settings

    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP
    
    if(!cameraIP){
      const titleName = globals.camera === undefined ? "No camera" : globals.camera
      await ev.action.setTitle(`${titleName}`)
      return
    }

    const direction = settings.mode as string;
    if (!["focusout", "focusin", "afocus" ].includes(direction)) {
      await ev.action.setTitle("Select");
      return;
    } 

    if(settings.mode) {
      if(settings.mode === "focusin"){
        ev.action.setTitle(`Focus in`)
        ev.action.setImage(`imgs/actions/focus/${settings.mode}.png`)
        
      } else if(settings.mode === "focusout"){
        ev.action.setTitle(`Focus out`)
        ev.action.setImage(`imgs/actions/focus/${settings.mode}.png`)

      } else if(settings.mode === "afocus") {
        ev.action.setTitle(`auto`)
        ev.action.setImage(`imgs/actions/focus/auto.png`)
      }
    }
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PtzFocus>){
    const settings = ev.payload.settings

    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP

    if(!cameraIP){
      const titleName = globals.camera === undefined ? "No camera" : globals.camera
      await ev.action.setTitle(`${titleName}`)
      return;
    }

    const direction = settings.mode as string;
    if (!["focusout", "focusin", "afocus" ].includes(direction)) {
      await ev.action.setTitle("Select");
      return;
    }

    if(settings.mode) {
      if(settings.mode === "focusin"){
        ev.action.setTitle(`Focus in`)
        ev.action.setImage(`imgs/actions/focus/${settings.mode}.png`)
        
      } else if(settings.mode === "focusout"){
        ev.action.setTitle(`Focus out`)
        ev.action.setImage(`imgs/actions/focus/${settings.mode}.png`)

      } else if(settings.mode === "afocus") {
        ev.action.setTitle(`auto`)
        ev.action.setImage(`imgs/actions/focus/auto.png`)
      }
    }
    
  }

  override async onKeyDown(ev: KeyDownEvent<PtzFocus>): Promise<void> {
    const settings = ev.payload.settings

    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP 

    if(!cameraIP){
      const titleName = globals.camera === undefined ? "No camera" : globals.camera
      await ev.action.setTitle(`${titleName}`)
      return;
    }

    const direction = settings.mode as string;
    if (!["focusout", "focusin", "afocus" ].includes(direction)) {
      await ev.action.setTitle("Select");
      return;
    }
    
    if(settings.mode) {
      if(settings.mode === "focusin"){
        ev.action.setTitle(`Focus in`)
        ev.action.setImage(`imgs/actions/focus/${settings.mode}.png`)
        
      } else if(settings.mode === "focusout"){
        ev.action.setTitle(`Focus out`)
        ev.action.setImage(`imgs/actions/focus/${settings.mode}.png`)

      } else if(settings.mode === "afocus") {
        ev.action.setTitle(`auto`)
        ev.action.setImage(`imgs/actions/focus/auto.png`)
      }
    }

    const apiBase = apiBaseCMD(globals.cameraIP)

    const speed = globals.focusSpeed;
    const mode = settings.mode;

    let url;
    let urlMode;
    if(mode === 'afocus') {
      url = `${apiBase}&${mode}`
    } else {
      urlMode = `${apiBase}&mfocus`;
      await fetch(urlMode);
      
      url = `${apiBase}&${mode}&${speed}`;
    }

    const response = await fetch(url);  

    if (!response.ok) {
      await ev.action.setImage(`imgs/actions/error.png`);
      await ev.action.setTitle("");
    }
  }

  override async onKeyUp(ev: KeyUpEvent<PtzFocus>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP
    const apiBase = apiBaseCMD(cameraIP)

    const url = `${apiBase}&focusstop&0`;
    
    await fetch(url);
  }
}
