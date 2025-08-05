import streamDeck, { action, KeyDownEvent, SingletonAction, type DidReceiveSettingsEvent } from "@elgato/streamdeck";

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

@action({ UUID: "ptz.register" })
export class PTZRegister extends SingletonAction<any> {

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent){
    const settings = ev.payload.settings;
    const cameraIP = settings.cameraIP
    const checkCamera = await checkCameraConnection(cameraIP)

    if(!checkCamera) {
      ev.action.setTitle('Not Connect')
    }

    streamDeck.settings.setGlobalSettings(settings);
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const settings = ev.payload.settings
    const checkCamera = await checkCameraConnection(settings.cameraIP)
    if(!checkCamera) {
      ev.action.setTitle('Not Connect')
    }
    streamDeck.settings.setGlobalSettings(settings);
  }

}