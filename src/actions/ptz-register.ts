import streamDeck, { action, KeyDownEvent, PropertyInspectorDidAppearEvent, SingletonAction, TitleParametersDidChangeEvent, WillAppearEvent, type DidReceiveSettingsEvent } from "@elgato/streamdeck";


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
  private timeCheck: number = 1000

  override async onWillAppear(ev: WillAppearEvent) {
    const settings = ev.payload.settings
    const globals = await streamDeck.settings.getGlobalSettings();

    //verificação se e undefined
    let cameraIP = settings.cameraIP === undefined ? false : settings.cameraIP
  
    if(!settings.camera){

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

  // override async onDidReceiveSettings(ev: DidReceiveSettingsEvent){
  //   const settings = ev.payload.settings
  //   const checkCamera = await checkCameraConnection(`${settings.cameraIP}`, this.timeCheck)
    
  //   if(!checkCamera) {
  //     ev.action.setTitle('Not\nConnect')
  //   } else {
  //     const titleName = settings.camera === undefined ? "" : settings.camera
  //     await ev.action.setTitle(`${titleName}`)
  //   }
  // }

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
    const titleName = settings.camera === undefined ? "" : settings.camera

    if(!checkCamera) {
      ev.action.setTitle('Not\nConnect')

      await streamDeck.settings.setGlobalSettings({
        ...globals,
        cameraIP: false,
        camera: "no camera",
      });

    } else {

      await ev.action.setTitle(`${titleName}`)
      
      await streamDeck.settings.setGlobalSettings({
        ...globals,
        cameraIP: cameraIP,
        camera: titleName
      });
    }
  }
}

// OnDid
 //   const settings = ev.payload.settings;
  //   const cameraIP = settings.cameraIP as string
  //   const titleName = settings.camera !== undefined ? settings.camera : ""

    
  //   const checkCamera = await checkCameraConnection(cameraIP, this.timeCheck)

  //   if(!checkCamera) {
  //     await ev.action.setTitle('Not\nConnect') 
  //   } else {
  //     await ev.action.setTitle(`${titleName}`)
  //   }