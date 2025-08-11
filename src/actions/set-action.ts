import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";



// Ações SET
@action({ UUID: "ptz.set" })
export class PTZSet extends SingletonAction{
  private isSet = false;

  override async onWillAppear(ev: WillAppearEvent) {
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

    // Converte para booleano corretamente
    this.isSet = globals.isSet === true || globals.isSet === "true";

    await ev.action.setTitle("Salvar");
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent){
    const globals = await streamDeck.settings.getGlobalSettings();

    const cameraIP = globals.cameraIP;

    if (!cameraIP) {
      await ev.action.setTitle("Sem Câmera");
      return;
    }

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
