import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, KeyUpEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

// export type PtzCount = {
//   direction: "more" | "less";
//   cameraIP: any;
// };

// // Ações
// @action({ UUID: "com.neoid.ptzneoid.count" })
// export class Count extends SingletonAction<PtzCount> {

//   override async onWillAppear(ev: WillAppearEvent<PtzCount>) {
//     const settings = ev.payload.settings

//     const globals = await streamDeck.settings.getGlobalSettings();
//     const cameraIP = globals.cameraIP

//     if(!cameraIP){
//       ev.action.setTitle(`Sem Camera`)
//       return;
//     }

//     if(settings.direction) {
//       ev.action.setTitle(`${settings.direction}`)
//       ev.action.setImage(`imgs/actions/count/${settings.direction}.png`)
//     }
//   }

//   override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PtzCount>) {
//     const settings = ev.payload.settings

//     const globals = await streamDeck.settings.getGlobalSettings();
//     const mode = globals.mode // saturation / hue / bgaintuning / rgaintuning / colorTemp
//     const cameraIP = globals.cameraIP

//     if(!cameraIP){
//       ev.action.setTitle(`Sem Camera`)
//       return;
//     }

//     if(settings.direction) {
//       ev.action.setTitle(`${settings.direction}`)
//       ev.action.setImage(`imgs/actions/count/${settings.direction}.png`)
//     }
//   }

//   override async onKeyDown(ev: KeyDownEvent<PtzCount>): Promise<void> {
//     const settings = ev.payload.settings

//     const globals = await streamDeck.settings.getGlobalSettings();

//     const cameraIP = globals.cameraIP

//     if(!cameraIP){
//       ev.action.setTitle(`Sem Camera`)
//       return;
//     }

//     if(settings.direction) {
//       ev.action.setTitle(`${settings.direction}`)
//       ev.action.setImage(`imgs/actions/count/${settings.direction}.png`)
//     }


//     let value

//     if(settings.direction === "more"){

//       if(globals.typeColor === "hue"){
//         const currentValue = Number(globals.hueValue ?? 1);
//         value = currentValue >= 14 ? 1 : currentValue + 1;
//       }

//     }

//     if(settings.direction === "less"){

//       if(globals.typeColor === "hue"){
//         const currentValue = Number(globals.hueValue ?? 1);
//         value = currentValue >= 14 ? 1 : currentValue - 1;
//       }

//     }


//     // Salvar no globalSettings
//     await streamDeck.settings.setGlobalSettings({
//       ...globals,
//       value: value,
//     });

//   }

  
// }



export type PtzCount = {
  direction: "more" | "less";
  cameraIP: any;
};

// Definição dos limites para cada tipo de cor
const COLOR_LIMITS = {
  saturation: { min: 60, max: 200, step: 10, default: 60 },
  hue: { min: 1, max: 14, step: 1, default: 1 },
  colorTemp: { min: 25, max: 80, step: 1, default: 25 },
  rgaintuning: { min: -1, max: 10, step: 1, default: 0 },
  bgaintuning: { min: -1, max: 10, step: 1, default: 0 },
};

@action({ UUID: "com.neoid.ptzneoid.count" })
export class Count extends SingletonAction<PtzCount> {

  public newValue: number = 0;

  override async onWillAppear(ev: WillAppearEvent<PtzCount>) {
    const settings = ev.payload.settings;
    const globals = await streamDeck.settings.getGlobalSettings();
    

    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      ev.action.setTitle(`Sem Câmera`);
      return;
    }

    if (settings.direction) {
      ev.action.setTitle(`${settings.direction}`);
      ev.action.setImage(`imgs/actions/count/${settings.direction}.png`);
    }
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PtzCount>) {
    // Só atualiza a imagem/título aqui
    const settings = ev.payload.settings;

    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      ev.action.setTitle(`Sem Câmera`);
      return;
    }

    if (settings.direction) {
      ev.action.setTitle(`${settings.direction}`);
      ev.action.setImage(`imgs/actions/count/${settings.direction}.png`);
    }

    const typeColor = globals.typeColor as keyof typeof COLOR_LIMITS;
    const globalKey = `${typeColor}Value`;

    await streamDeck.settings.setGlobalSettings({
      ...globals,
      [globalKey]: this.newValue,
    });
  }

  override async onKeyDown(ev: KeyDownEvent<PtzCount>): Promise<void> {
    const settings = ev.payload.settings;
    const globals = await streamDeck.settings.getGlobalSettings();
    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      ev.action.setTitle(`Sem Câmera`);
      return;
    }

    // Verifica se tipo de cor é válido
    const typeColor = globals.typeColor as keyof typeof COLOR_LIMITS;
    const limits = COLOR_LIMITS[typeColor];
    const globalKey = `${typeColor}Value`;

    const currentValue = Number(globals[globalKey] ?? limits.default);

    this.newValue = currentValue;

    if (settings.direction === "more") {
      this.newValue = Math.min(currentValue + limits.step, limits.max);
    }

    if (settings.direction === "less") {
      this.newValue = Math.max(currentValue - limits.step, limits.min);
    }

    await streamDeck.settings.setGlobalSettings({
      ...globals,
      [globalKey]: this.newValue,
    });
  }
}



