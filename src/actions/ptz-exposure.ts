import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction } from "@elgato/streamdeck";
import { apiBasePtzPostImageValue } from "../utils/ptz-api-post-image-value";

export type PtzExposureProps = {
  gain?: number;
  iris?: string;
  aemode: "3" | "0" | "11";
};


// iris: /cgi-bin/ptzctrl.cgi?post_image_value&[value]

//Mode:  /cgi-bin/ptzctrl.cgi?post_image_value&aemode&

//ganho: /cgi-bin/ptzctrl.cgi?post_image_value&gain&[range]

async function move(settings: PtzExposureProps, cameraIP: any) {

  const apiBase = apiBasePtzPostImageValue(cameraIP)
  // const apiBase = `http://192.168.100.88/cgi-bin/ptzctrl.cgi?post_image_value`

  const gain = settings.gain;
  const iris = settings.iris;
  const aemodeValue = settings.aemode;


  const urlAemode = `${apiBase}&aemode&${aemodeValue}`;
  const urlIris = `${apiBase}&${iris}`;
  const urlGain = `${apiBase}&${gain}`;

  
  await fetch(urlAemode);
  await fetch(urlIris);
  await fetch(urlGain);
}


// Ações
@action({ UUID: "ptz.exposure" })
export class PtzExposure extends SingletonAction<PtzExposureProps> {

  override async onKeyDown(ev: KeyDownEvent<PtzExposureProps>): Promise<void> {
    const settings = ev.payload.settings
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP
    await move(settings, cameraIP);
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PtzExposureProps>){
    await streamDeck.settings.getGlobalSettings();
  }
  
}

