import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent, type DidReceiveSettingsEvent } from "@elgato/streamdeck";

// async function checkCameraConnection(cameraIP: any) {
//     // try each route to see if camera is accessible. A good response from either is success
//   try {
//     const res = await fetch(`http://${cameraIP}/cgi-bin/param.cgi?get_device_conf`, { mode: 'no-cors' });
//     if (!res.ok) return false;
//     return true;
//   } catch (err) {
//     return false;
//   }

// } 

async function checkCameraConnection(cameraIP: string, timeout = 5000): Promise<boolean> {
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
  private timeCheck: number = 1000

  override async onWillAppear(ev: WillAppearEvent) {
    const settings = ev.payload.settings;
    const cameraIP = settings.cameraIP as string
    const checkCamera = await checkCameraConnection(cameraIP, this.timeCheck)

    if(!checkCamera) {
      await ev.action.setTitle('Not\nConnect') 
    } else {
      await ev.action.setTitle(`${settings.camera}`)  
    }
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent){
    const settings = ev.payload.settings;
    const cameraIP = settings.cameraIP as string
    
    const checkCamera = await checkCameraConnection(cameraIP, this.timeCheck)


    if(!checkCamera) {
      await ev.action.setTitle('Not\nConnect') 
    } else {
      await ev.action.setTitle(`${settings.camera}`) 
    }
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const settings = ev.payload.settings
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = settings.cameraIP as string
    const checkCamera = await checkCameraConnection(cameraIP, this.timeCheck)

    if(!checkCamera) {
      ev.action.setTitle('Not\nConnect')

      await streamDeck.settings.setGlobalSettings({
        ...globals,
        cameraIP: false,
        camera: "no camera",
      });

    } else {
      await ev.action.setTitle(`${settings.camera}`)
      
      await streamDeck.settings.setGlobalSettings({
        ...globals,
        cameraIP: settings.cameraIP,
        camera: settings.camera,
      });
    }

  }

}