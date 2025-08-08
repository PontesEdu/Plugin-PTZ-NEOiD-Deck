import streamDeck, { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";



// Ações SET
@action({ UUID: "ptz.set" })
export class PTZSet extends SingletonAction{
  private isSet = false;

  override async onWillAppear(ev: WillAppearEvent) {
    const globals = await streamDeck.settings.getGlobalSettings();

    // Converte para booleano corretamente
    this.isSet = globals.isSet === true || globals.isSet === "true";

    await ev.action.setTitle("Salvar");
  }

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
  const globals = await streamDeck.settings.getGlobalSettings();
  const cameraIP = globals.cameraIP;

  if (!cameraIP) {
    await ev.action.setTitle("Sem Câmera");
    return;
  }

  // alterna o estado
  this.isSet = !Boolean(globals.isSet);

  // salva globalmente
  await streamDeck.settings.setGlobalSettings({
    ...globals,
    isSet: this.isSet,
  });
  }

}


// export const toBool = (v: unknown): boolean =>
//   v === true || v === "true" || v === 1 || v === "1" || v === "on";

// @action({ UUID: "ptz.set" })
// export class PTZSet extends SingletonAction {
//   private isSet = false;

//   override async onWillAppear(ev: WillAppearEvent) {
//     const globals: any = (await streamDeck.settings.getGlobalSettings()) ?? {};
//     this.isSet = toBool(globals.isSet);
//     await ev.action.setTitle(this.isSet ? "Set ON" : "Set OFF");
//     await ev.action.setImage(this.isSet ? "imgs/actions/set/set-on.png" : "imgs/actions/set/set-off.png");
//   }

//   override async onKeyDown(ev: KeyDownEvent): Promise<void> {
//     const globals: any = (await streamDeck.settings.getGlobalSettings()) ?? {};
//     this.isSet = !toBool(globals.isSet);
//     await streamDeck.settings.setGlobalSettings({ ...globals, isSet: this.isSet });
//     await ev.action.setTitle(this.isSet ? "Set ON" : "Set OFF");
//     await ev.action.setImage(this.isSet ? "imgs/actions/set/set-on.png" : "imgs/actions/set/set-off.png");
//   }
// }