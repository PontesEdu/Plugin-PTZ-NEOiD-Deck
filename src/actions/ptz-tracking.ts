import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendViscaTCP } from "../utils/send-visca-tcp";



// Ações
@action({ UUID: "com.neoid.ptzneoid.ptz-tracking" })
export class PTZTracking extends SingletonAction {
  private isTracking = false;

  override async onWillAppear(ev: WillAppearEvent) {
  const globals = await streamDeck.settings.getGlobalSettings();
  const settings = ev.payload.settings;
  const currentMode = settings.mode as string; // "presenter", "zona" ou "frame"

  if (!globals.cameraIP) {
    await ev.action.setTitle(`${globals.camera || "No Camera"}`);
    return;
  }

  if (!["presenter", "zona", "frame"].includes(currentMode)) {
    await ev.action.setTitle("Select");
    return;
  }

  const isActive = globals.isTracking && globals.activeMode === currentMode;

  await ev.action.setTitle(
    isActive ? `Tracking\n${currentMode}\nON` : `Tracking\n${currentMode}\nOFF`
  );
  ev.action.setImage(
    isActive
      ? "imgs/actions/tracking/tracking-on.png"
      : "imgs/actions/tracking/tracking-off.png"
  );
}

override async onDidReceiveSettings(ev: DidReceiveSettingsEvent) {
  const globals = await streamDeck.settings.getGlobalSettings();
  const settings = ev.payload.settings;
  const currentMode = settings.mode as string; // "presenter", "zona" ou "frame"

  if (!globals.cameraIP) {
    await ev.action.setTitle(`${globals.camera || "No Camera"}`);
    return;
  }

  if (!["presenter", "zona", "frame"].includes(currentMode)) {
    await ev.action.setTitle("Select");
    return;
  }

  const isActive = globals.isTracking && globals.activeMode === currentMode;

  await ev.action.setTitle(
    isActive ? `Tracking\n${currentMode}\nON` : `Tracking\n${currentMode}\nOFF`
  );
  ev.action.setImage(
    isActive
      ? "imgs/actions/tracking/tracking-on.png"
      : "imgs/actions/tracking/tracking-off.png"
  );
}




  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
  const globals = await streamDeck.settings.getGlobalSettings();
  const cameraIP = globals.cameraIP as string;

  if (!cameraIP) {
    ev.action.setTitle(`${globals.camera}`);
    return;
  }

  const settings = ev.payload.settings;
  const currentMode = settings.mode as string; // "presenter", "zona" ou "frame"

  if (!["presenter", "zona", "frame"].includes(currentMode)) {
    await ev.action.setTitle("Select");
    return;
  }

  // Mapeia os comandos de cada modo
  const viscaCommands: Record<string, { on: string; off: string }> = {
    presenter: {
      on: "81 0a 11 54 02 ff",
      off: "81 0a 11 54 03 ff",
    },
    zona: {
      on: "81 0a 11 55 02 ff", // coloque o comando correto
      off: "81 0a 11 55 03 ff",
    },
    frame: {
      on: "81 0a 11 56 02 ff", // coloque o comando correto
      off: "81 0a 11 56 03 ff",
    },
  };

  // --- 1. Primeiro desliga todos os botões visualmente ---
  this.actions.forEach(async (action) => {
    await action.setTitle(`Tracking\nOFF`);
    action.setImage("imgs/actions/tracking/tracking-off.png");
  });

  // --- 2. Se já estava no mesmo modo -> só desliga tracking ---
  if (globals.isTracking && globals.activeMode === currentMode) {
    sendViscaTCP(cameraIP, viscaCommands[currentMode].off);

    await streamDeck.settings.setGlobalSettings({
      ...globals,
      isTracking: false,
      activeMode: null,
    });
    return;
  }

  // --- 3. Ativa o modo atual ---
  sendViscaTCP(cameraIP, viscaCommands[currentMode].on);
  await ev.action.setTitle(`Tracking\n${currentMode}\nON`);
  ev.action.setImage("imgs/actions/tracking/tracking-on.png");

  await streamDeck.settings.setGlobalSettings({
    ...globals,
    isTracking: true,
    activeMode: currentMode,
  });
}



  // override async onKeyDown(ev: KeyDownEvent): Promise<void> {
  //   const globals = await streamDeck.settings.getGlobalSettings();
  //   const cameraIP = globals.cameraIP as string;
    
  //   if (!cameraIP) {
  //     ev.action.setTitle(`${globals.camera}`)
  //     return;
  //   }
  //   const settings = ev.payload.settings
    
  //   this.isTracking = !this.isTracking;

  //   if(settings.mode === "presenter"){

  //     if (this.isTracking) {
  //       sendViscaTCP(cameraIP, "81 0a 11 54 02 ff"); // LIGA
  //       await ev.action.setTitle("Tracking\n ON");
  //       ev.action.setImage(`imgs/actions/tracking/tracking-on.png`)
  //     } else { 
  //       sendViscaTCP(cameraIP, "81 0a 11 54 03 ff"); // DESLIGA (ajuste se for diferente)
  //       await ev.action.setTitle("Tracking\n OFF");
  //       ev.action.setImage(`imgs/actions/tracking/tracking-off.png`)
  //     }

  //   } else if(settings.mode === "zona"){

  //     if (this.isTracking) {
  //       sendViscaTCP(cameraIP, "81 0a 11 54 02 ff"); // LIGA
  //       await ev.action.setTitle("Tracking\n ON");
  //       ev.action.setImage(`imgs/actions/tracking/tracking-on.png`)
  //     } else { 
  //       sendViscaTCP(cameraIP, "81 0a 11 54 03 ff"); // DESLIGA (ajuste se for diferente)
  //       await ev.action.setTitle("Tracking\n OFF");
  //       ev.action.setImage(`imgs/actions/tracking/tracking-off.png`)
  //     }

  //   } else if(settings.mode === "frame"){
  //     if (this.isTracking) {
  //       sendViscaTCP(cameraIP, "81 0a 11 54 02 ff"); // LIGA
  //       await ev.action.setTitle("Tracking\n ON");
  //       ev.action.setImage(`imgs/actions/tracking/tracking-on.png`)
  //     } else { 
  //       sendViscaTCP(cameraIP, "81 0a 11 54 03 ff"); // DESLIGA (ajuste se for diferente)
  //       await ev.action.setTitle("Tracking\n OFF");
  //       ev.action.setImage(`imgs/actions/tracking/tracking-off.png`)
  //     }
  //   }

  //   await streamDeck.settings.setGlobalSettings({
  //     ...globals,
  //     isTracking: this.isTracking,
  //   });
  // }
}

