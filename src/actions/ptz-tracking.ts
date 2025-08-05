import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction } from "@elgato/streamdeck";

type PtzTrackingProps = {
  mode: "on" | "off";
};

// const apiBase = "http://192.168.100.88/cgi-bin/param.cgi?set_overlay&autotracking";


// fetch("http://192.168.0.88/cgi-bin/param.cgi?post_visca", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded"
//   },
//   body: "cururl=http://&len=7&visca=0x81,0x0a,0x01,0x04,0x1d,0x17,0xff"
// })
// .then(response => response.text())
// .then(data => {
//   console.log("Resposta:", data);
// })
// .catch(error => {
//   console.error("Erro ao enviar comando VISCA:", error);
// });
  
  // const apiBase = `http://192.168.100.88/cgi-bin/ptzctrl.cgi?ptzcmd`

async function move(cameraIP: any) {

  const response = await fetch(`http://${cameraIP}/cgi-bin/param.cgi?post_visca`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify({
      cururl: "http://",
      len: 7,
      visca: "0x81,0x0a,0x01,0x04,0x1d,0x17,0xff"
    })
  });
}




// Ações
@action({ UUID: "ptz.tracking" })
export class PTZTracking extends SingletonAction<PtzTrackingProps> {

  override async onKeyDown(ev: KeyDownEvent<PtzTrackingProps>): Promise<void> {

    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP
   if(cameraIP){
      await move(cameraIP);
    } else{
      ev.action.setTitle(`Sem Camera`)
    }
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PtzTrackingProps>){
    await streamDeck.settings.getGlobalSettings();
  }
}

