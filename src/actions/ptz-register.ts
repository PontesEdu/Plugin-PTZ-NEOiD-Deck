import streamDeck, { action, SingletonAction, type DidReceiveSettingsEvent } from "@elgato/streamdeck";

@action({ UUID: "ptz.register" })
export class PTZRegister extends SingletonAction<any> {
  override onDidReceiveSettings(ev: DidReceiveSettingsEvent): void {
  const s = ev.payload.settings;
  streamDeck.settings.setGlobalSettings(s);
}
}