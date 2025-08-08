import streamDeck, { action, DidReceiveGlobalSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent, type DidReceiveSettingsEvent } from "@elgato/streamdeck";


export type PTZSpeedProps = {
  speed: "pan" | "zoom" | "focus";
};

type PTZConfig = {
  pan: number;
  zoom: number;
  focus: number;
};


@action({ UUID: "ptz.speed" })
export class PTZSpeed extends SingletonAction{
  static speedLevel = 1;
  static readonly maxLevel = 10;
  static readonly minLevel = 1;
  private static readonly maxValues: PTZConfig = {
    pan: 24,
    zoom: 7,
    focus: 7,
  };
  static level = {
    pan: 1,
    zoom: 1,
    focus: 1,
  };

  override async onKeyDown(ev: KeyDownEvent<PTZSpeedProps>): Promise<void> {
    
    const settings = ev.payload.settings;
    const tipo = settings.speed as "pan" | "zoom" | "focus";

    if (!["pan", "zoom", "focus"].includes(tipo)) {
      await ev.action.setTitle("Selecione um tipo");
      return;
    }

    // Pega os valores globais atuais
    const globals = await streamDeck.settings.getGlobalSettings();

    // Converte o level atual para número (com fallback para 1)
    let levelAtual = Number(globals[`${tipo}Level`] ?? 1);
    if (isNaN(levelAtual) || levelAtual < 1 || levelAtual > 10) {
      levelAtual = 1;
    }

    // Atualiza o level com loop de 1 a 10
    levelAtual++;
    if (levelAtual > 10) levelAtual = 1;

    // Calcula a velocidade com base no level
    const maxValue = PTZSpeed.maxValues[tipo]; // 24, 7, 7
    const calculado = Math.round((levelAtual / 10) * maxValue);

    // Atualiza o título do botão
    await ev.action.setTitle(`${tipo === 'pan' ? 'P/T' : tipo}: ${levelAtual}`);

    // Atualiza os globals com a nova velocidade e level
    await streamDeck.settings.setGlobalSettings({
      ...globals,
      [`${tipo}Speed`]: calculado,
      [`${tipo}Level`]: levelAtual,
    });
  }

  // private calcularSpeed(level: number, max: number): number {
  //   const percentual = level * 10;
  //   const valor = Math.round((percentual / 100) * max);
  //   return Math.max(1, valor); // evita zero
  // }
}

  
