import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction } from "@elgato/streamdeck";
import net from 'net';

type PtzTrackingProps = {
  mode: "on" | "off";
};

// const apiBase = "http://192.168.100.88/cgi-bin/param.cgi?set_overlay&autotracking";

async function move(cameraIP: any, viscaHex: string) {

  // const response = await fetch(`http://${cameraIP}/cgi-bin/param.cgi?post_visca`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'text/plain'
  //   },
  //   body: JSON.stringify({
  //     cururl: "http://",
  //     len: 7,
  //     visca: "0x81,0x0a,0x01,0x04,0x1d,0x17,0xff"
  //   })
  // });
  
 
 	
// 81 0a 11 54 03 ff desativar

  // visca: ["0x81", "0x0a", "0x01","0x04","0x1d","0x17","0xff"]
  // const body = {
  //   cururl: "",
  //   len: 7,
  //   visca: ["81 0a 11 54 02 ff"] ativar
  // };

  // await fetch(`http://${cameraIP}/cgi-bin/param.cgi?post_visca`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify(body)
  // });


  const bytes = Uint8Array.from(viscaHex.split(' ').map(b => parseInt(b, 16)));
  const client = net.createConnection({ host: cameraIP, port: 5678 }, () => {
    client.write(bytes);
  });
  client.on('data', data => {
    console.log('Resposta da câmera:', data.toString('hex'));
    client.end();
  });
  client.on('error', err => {
    console.error('Erro na conexão TCP:', err);
  });
}




// Ações
@action({ UUID: "ptz.tracking" })
export class PTZTracking extends SingletonAction<PtzTrackingProps> {

  override async onKeyDown(ev: KeyDownEvent<PtzTrackingProps>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP
   if(cameraIP){
      await move(cameraIP, '81 0a 11 54 03 ff');
    } else{
      ev.action.setTitle(`Sem Camera`)
    }
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PtzTrackingProps>){
    await streamDeck.settings.getGlobalSettings();
  }
}

