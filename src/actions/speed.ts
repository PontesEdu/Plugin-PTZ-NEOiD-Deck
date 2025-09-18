import streamDeck, { action, DidReceiveGlobalSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent, type DidReceiveSettingsEvent } from "@elgato/streamdeck";


export type PTZSpeedProps = {
  speed: "pan" | "zoom" | "focus";
};

type PTZConfig = {
  pan: number;
  zoom: number;
  focus: number;
};

@action({ UUID: "com.neoid.ptzneoid.ptz-speed" })
export class PTZSpeed extends SingletonAction {
  private static readonly speedModes = ["slowest", "slow", "normal", "fast", "fastest"] as const;
  private static readonly modeValues: Record<typeof PTZSpeed.speedModes[number], number> = {
    slowest: 2,
    slow: 4,
    normal: 6,
    fast: 8,
    fastest: 10,
  };

  private static readonly maxValues: PTZConfig = {
    pan: 24,
    zoom: 7,
    focus: 7,
  };

  override async onWillAppear(ev: WillAppearEvent<PTZSpeedProps>) {
    const settings = ev.payload.settings;
    const globals = await streamDeck.settings.getGlobalSettings();

    const tipo = settings.speed as "pan" | "zoom" | "focus";

    if (!["pan", "zoom", "focus"].includes(tipo)) {
      await ev.action.setTitle("Select");
      return;
    }

    const currentMode = globals[`${tipo}Mode`] ?? "normal";
    await ev.action.setTitle(`${tipo === "pan" ? "P/T" : tipo}:\n${currentMode}`);
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PTZSpeedProps>) {
    const settings = ev.payload.settings;
    const tipo = settings.speed as "pan" | "zoom" | "focus";

    if (!["pan", "zoom", "focus"].includes(tipo)) {
      await ev.action.setTitle("Select");
      return;
    }

    const globals = await streamDeck.settings.getGlobalSettings();
    const currentMode = globals[`${tipo}Mode`] ?? "normal";

    await ev.action.setTitle(`${tipo === "pan" ? "P/T" : tipo}:\n${currentMode}`);
  }

  // KEYDOWN
  override async onKeyDown(ev: KeyDownEvent<PTZSpeedProps>): Promise<void> {
    const settings = ev.payload.settings;
    const tipo = settings.speed as "pan" | "zoom" | "focus";

    if (!["pan", "zoom", "focus"].includes(tipo)) {
      await ev.action.setTitle("Select");
      return;
    }

    const globals = await streamDeck.settings.getGlobalSettings();

    // pega o modo atual
    const currentMode = globals[`${tipo}Mode`] ?? "normal";
    const indexAtual = PTZSpeed.speedModes.indexOf(currentMode as typeof PTZSpeed.speedModes[number]);
    const nextIndex = (indexAtual + 1) % PTZSpeed.speedModes.length;
    const nextMode = PTZSpeed.speedModes[nextIndex];

    // converte para valor proporcional
    const maxValue = PTZSpeed.maxValues[tipo];
    const calculado = Math.round((PTZSpeed.modeValues[nextMode] / 10) * maxValue);

    // atualiza o título
    await ev.action.setTitle(`${tipo === "pan" ? "P/T" : tipo}:\n${nextMode}`);


    // salva no global
    await streamDeck.settings.setGlobalSettings({
      ...globals,
      [`${tipo}Mode`]: nextMode,
      [`${tipo}Speed`]: calculado,
    });
  }
}

  
