import streamDeck, { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent} from "@elgato/streamdeck";

// Ações
@action({ UUID: "com.neoid.ptzneoid.default" })
export class Default extends SingletonAction {

  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const globals = await streamDeck.settings.getGlobalSettings();

    await streamDeck.settings.setGlobalSettings({
      ...globals,
      [`panMode`]: "normal",
      [`zoomMode`]: "normal",
      [`focusMode`]: "normal",
    });
  }
}

