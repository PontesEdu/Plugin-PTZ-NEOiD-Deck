import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent, type DidReceiveSettingsEvent } from "@elgato/streamdeck";

async function checkCameraConnection(cameraIP: any) {
    // try each route to see if camera is accessible. A good response from either is success
  try {
    const res = await fetch(`http://${cameraIP}/cgi-bin/param.cgi?get_device_conf`, { mode: 'no-cors' });
    if (!res.ok) return false;
    return true;
  } catch (err) {
    return false;
  }
} 

@action({ UUID: "com.neoid.ptzneoid.ptz-register" })
export class PTZRegister extends SingletonAction<any> {

  override async onWillAppear(ev: WillAppearEvent) {
    const settings = ev.payload.settings;
    const cameraIP = settings.cameraIP
    const checkCamera = await checkCameraConnection(cameraIP)

    if(!checkCamera) {
      await ev.action.setTitle('Not Connect') 
    } else {
      await ev.action.setTitle(`${settings.camera}`)  
    }
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent){
    const settings = ev.payload.settings;
    const cameraIP = settings.cameraIP
    const checkCamera = await checkCameraConnection(cameraIP)

    if(!checkCamera) {
      await ev.action.setTitle('Not Connect') 
    } else {
      await ev.action.setTitle(`${settings.camera}`) 
    }
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const settings = ev.payload.settings
    const globals = await streamDeck.settings.getGlobalSettings();
    const checkCamera = await checkCameraConnection(settings.cameraIP)

    if(!checkCamera) {
      ev.action.setTitle('Not Connect')
    } else {
      await ev.action.setTitle(`${settings.camera}`) 
    }

    
    await streamDeck.settings.setGlobalSettings({
      ...globals,
      cameraIP: settings.cameraIP,
      camera: settings.camera,
    });
  }

}