import streamDeck, { action, DidReceiveGlobalSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent, type DidReceiveSettingsEvent } from "@elgato/streamdeck";


export type PTZWbmodeColorProps = {
  wbmodecolor: "saturation" | "hue" | "colorTemp" |"none";
};

const saturationValues = [
  60, 70, 80, 90, 100, 110, 120, 130,
  140, 150, 160, 170, 180, 190, 200
];

@action({ UUID: "com.neoid.ptzneoid.wbmodecolor" })
export class WbmodeColor extends SingletonAction {
  static wbmodecolorLevel = 1;

  override async onWillAppear(ev: WillAppearEvent<PTZWbmodeColorProps>) {
    const settings = ev.payload.settings;
    const globals = await streamDeck.settings.getGlobalSettings();

    const selectedMode = settings.wbmodecolor;

    if (!selectedMode || selectedMode === "none" || selectedMode == undefined) {
      ev.action.setTitle("Select Mode");
      return;
    }

    await ev.action.setTitle(`${selectedMode}: ${globals[`${selectedMode}Value`]}`);
  }

  override async onKeyDown(ev: KeyDownEvent<PTZWbmodeColorProps>): Promise<void> {
    const settings = ev.payload.settings;
    const globals = await streamDeck.settings.getGlobalSettings();
    

    const selectedMode = settings.wbmodecolor;

    if (!selectedMode || selectedMode === "none" || selectedMode == undefined) {
      ev.action.setTitle("Select Mode");
      return;
    }

    if (selectedMode === "saturation") {
      const currentValue = Number(globals.saturationValue ?? saturationValues[0]);
      const currentIndex = saturationValues.indexOf(currentValue);
      const nextIndex = (currentIndex + 1) % saturationValues.length;
      const nextValue = saturationValues[nextIndex];

      // Chamada para API da câmera (ou sistema de controle)
      await fetch(`http://192.168.100.88/cgi-bin/ptzctrl.cgi?post_image_value&saturation&${nextValue}`);

      // Salvar no globalSettings
      await streamDeck.settings.setGlobalSettings({
        ...globals,
        saturationValue: nextValue,
      });

      // Atualizar título do botão
      ev.action.setTitle(`Saturation:\n${nextValue}%`);
    }

    if (selectedMode === "colorTemp") {
      const currentValue = Number(globals.colorTempValue ?? 25);
      const nextValue = currentValue >= 80 ? 25 : currentValue + 1;

      // Chamada para API da câmera (ou sistema de controle)
      await fetch(`http://192.168.100.88/cgi-bin/ptzctrl.cgi?post_image_value&colortemp&${nextValue}`);

      // Salvar no globalSettings
      await streamDeck.settings.setGlobalSettings({
        ...globals,
        colorTempValue: nextValue,
      });

      // Atualizar título do botão
      ev.action.setTitle(`color Temp:\n${nextValue}`);
    }

    if (selectedMode === "hue") {
      const currentValue = Number(globals.hueValue ?? 1);
      const nextValue = currentValue >= 14 ? 1 : currentValue + 1;

      // Chamada para API da câmera (ou sistema de controle)
      await fetch(`http://192.168.100.88/cgi-bin/ptzctrl.cgi?post_image_value&hue&${nextValue}`);

      // Salvar no globalSettings
      await streamDeck.settings.setGlobalSettings({
        ...globals,
        hueValue: nextValue,
      });

      // Atualizar título do botão
      ev.action.setTitle(`Hue: ${nextValue}`);
    }
  }
}

