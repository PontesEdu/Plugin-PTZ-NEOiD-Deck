import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import net from 'net';
import dgram from 'dgram';
import { sendViscaUDP } from "../utils/send-visca-udp";
import { sendViscaTCP } from "../utils/send-visca-tcp";

type PtzTrackingProps = {
  mode: "on" | "off";
};

// Ações
@action({ UUID: "ptz.tracking" })
export class PTZTracking extends SingletonAction<PtzTrackingProps> {
  private isTracking = false;

  override async onWillAppear(ev: WillAppearEvent<PtzTrackingProps>) {
    const globals = await streamDeck.settings.getGlobalSettings();

    // Converte para booleano corretamente
    this.isTracking = globals.isTracking === true || globals.isTracking === "true";

    await ev.action.setTitle(this.isTracking ? "Tracking ON" : "Tracking OFF");
  }

  override async onKeyDown(ev: KeyDownEvent<PtzTrackingProps>): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

    this.isTracking = !this.isTracking;

    if (this.isTracking) {
      sendViscaUDP(cameraIP, "81 0a 11 54 02 ff"); // LIGA
      await ev.action.setTitle("Tracking ON");
      ev.action.setImage(`imgs/actions/tracking/tracking-on.png`)
    } else {
      sendViscaUDP(cameraIP, "81 0a 11 54 03 ff"); // DESLIGA (ajuste se for diferente)
      await ev.action.setTitle("Tracking OFF");
      ev.action.setImage(`imgs/actions/tracking/tracking-off.png`)
    }

    await streamDeck.settings.setGlobalSettings({
      ...globals,
      isTracking: this.isTracking,
    });
  }

  // override async onKeyDown(ev: KeyDownEvent<PtzTrackingProps>): Promise<void> {
  //   const globals = await streamDeck.settings.getGlobalSettings();
  //   const cameraIP = globals.cameraIP

  //  if(cameraIP){
  //     if(this.isTracking){
  //       sendViscaUDP(cameraIP, '81 0a 11 54 02 ff') //com o comando de ligar o traking
  //     } else {
  //       sendViscaUDP(cameraIP, '81 0a 11 54 02 ff') //com o comando de desligar o traking
  //     }
  //   } else{
  //     ev.action.setTitle(`Sem Camera`)
  //   }

  // }

  // override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PtzTrackingProps>){
  //   await streamDeck.settings.getGlobalSettings();
  // }
}

