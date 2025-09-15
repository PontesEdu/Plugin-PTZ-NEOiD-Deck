import streamDeck, { action, KeyDownEvent, PropertyInspectorDidAppearEvent, PropertyInspectorDidDisappearEvent, SingletonAction, Target, TitleParametersDidChangeEvent, WillAppearEvent, type DidReceiveSettingsEvent } from "@elgato/streamdeck";
import { PTZControls } from "./ptz-controls";
import { PTZTracking } from './ptz-tracking';
import { PTZPreset } from "./preset";
import { PTZFocus } from "./ptz-focus";
import { PTZZoom } from "./ptz-zoom";
import { Backlight } from "./backlight";
import { Osd } from "./osd";


export async function checkCameraConnection(cameraIP: string, timeout = 5000): Promise<boolean> {
  const fetchPromise = (async () => {
    try {
      const res = await fetch(`http://${cameraIP}/cgi-bin/param.cgi?get_device_conf`, { mode: 'no-cors' });
      return res.ok;
    } catch {
      return false;
    }
  })();

  const timeoutPromise = new Promise<boolean>(resolve =>
    setTimeout(() => resolve(false), timeout)
  );

  return Promise.race([fetchPromise, timeoutPromise]);
}



@action({ UUID: "com.neoid.ptzneoid.ptz-register" })
export class PTZRegister extends SingletonAction<any> {
  private timeCheck: number = 500
  ptzControls: PTZControls
  ptzTracking: PTZTracking
  ptzPreset: PTZPreset
  ptzFocus: PTZFocus
  ptzZoom: PTZZoom
  ptzBacklight: Backlight
  ptzOSD: Osd


  constructor(ptzControls: PTZControls, ptzTracking: PTZTracking, preset: PTZPreset, ptzFocus: PTZFocus, ptzZoom: PTZZoom, backlight: Backlight, osd: Osd) {
		super();
		this.ptzControls = ptzControls;
		this.ptzTracking = ptzTracking;
    this.ptzPreset = preset;
    this.ptzFocus = ptzFocus;
    this.ptzZoom = ptzZoom;
    this.ptzBacklight = backlight;
    this.ptzOSD = osd;
	}


  override async onPropertyInspectorDidDisappear(ev: PropertyInspectorDidDisappearEvent) {
    const settings = await ev.action.getSettings();
    const globals = await streamDeck.settings.getGlobalSettings();

    //verificação se e undefined
    let cameraIP = settings.cameraIP === undefined ? false : settings.cameraIP
  
    if(!settings.cameraIP){

      await ev.action.setSettings({...settings, cameraIP: globals.cameraIP});
      cameraIP = globals.cameraIP as string
    } 
    
    const checkCamera = await checkCameraConnection(`${cameraIP}`, this.timeCheck)
  
    if(!checkCamera) {
      ev.action.setTitle('Not\nConnect')
      
    } else {
      const titleName = settings.camera === undefined ? "" : settings.camera
      await ev.action.setTitle(`${titleName}`)
    }
      
  }

  override async onWillAppear(ev: WillAppearEvent) {
    const settings = ev.payload.settings
    const globals = await streamDeck.settings.getGlobalSettings();

    //verificação se e undefined
    let cameraIP = settings.cameraIP === undefined ? false : settings.cameraIP
  
    if(!settings.cameraIP){

      await ev.action.setSettings({...settings, cameraIP: globals.cameraIP});
      cameraIP = globals.cameraIP as string
    } 
    
    const checkCamera = await checkCameraConnection(`${cameraIP}`, this.timeCheck)
  
    if(!checkCamera) {
      ev.action.setTitle('Not\nConnect')
      
    } else {
      const titleName = settings.camera === undefined ? "" : settings.camera
      await ev.action.setTitle(`${titleName}`)
    }
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent){
    const settings = ev.payload.settings
    
    const titleName = settings.camera === undefined ? "" : settings.camera
    await ev.action.setTitle(`${titleName}`)
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const settings = ev.payload.settings
    const globals = await streamDeck.settings.getGlobalSettings();

    //verificação se e undefined
    let cameraIP = settings.cameraIP === undefined ? false : settings.cameraIP
  
    if(!cameraIP){
      await ev.action.setSettings({...settings, cameraIP: globals.cameraIP});
      cameraIP = globals.cameraIP as string
    } 
    
    const checkCamera = await checkCameraConnection(`${cameraIP}`, this.timeCheck)
    let titleName;

    if(!checkCamera) {
      ev.action.setTitle('Not\nConnect')

      titleName = "no camera"
      
      await streamDeck.settings.setGlobalSettings({
        ...globals,
        cameraIP: false,
        camera: "no camera",
      });


    } else {
      titleName = settings.camera === undefined ? "" : settings.camera as string

      await ev.action.setTitle(`${titleName}`)
      
      await streamDeck.settings.setGlobalSettings({
        ...globals,
        cameraIP: cameraIP,
        camera: titleName
      });
    }
    
    this.ptzControls.actions.forEach(actionInstance => {
      actionInstance.setTitle(`${titleName}`);
    });

    this.ptzTracking.actions.forEach(actionInstance => {
      actionInstance.getSettings()
    });

    this.ptzPreset.actions.forEach(actionInstance => {
      actionInstance.getSettings()
    });

    this.ptzFocus.actions.forEach(actionInstance => {
      actionInstance.getSettings()
    });

    this.ptzZoom.actions.forEach(actionInstance => {
      actionInstance.getSettings()
    });

    this.ptzBacklight.actions.forEach(actionInstance => {
      actionInstance.getSettings()
    });

    this.ptzOSD.actions.forEach(actionInstance => {
      actionInstance.getSettings()
    });

  }
}