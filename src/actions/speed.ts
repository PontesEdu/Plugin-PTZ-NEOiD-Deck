import streamDeck, { action, DidReceiveGlobalSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent, type DidReceiveSettingsEvent } from "@elgato/streamdeck";


export type PTZSpeedProps = {
  speed: "pan" | "zoom" | "focus";
};

type PTZConfig = {
  pan: number;
  zoom: number;
  focus: number;
};


// @action({ UUID: "com.neoid.ptzneoid.ptz-speed" })
// export class PTZSpeed extends SingletonAction{
//   static speedLevel = 1;
//   static readonly maxLevel = 10;
//   static readonly minLevel = 1;
//   private static readonly maxValues: PTZConfig = {
//     pan: 24,
//     zoom: 7,
//     focus: 7,
//   };
//   static level = {
//     pan: 1,
//     zoom: 1,
//     focus: 1,
//   };
  

//   override async onWillAppear(ev: WillAppearEvent<PTZSpeedProps>) {
//     const settings = ev.payload.settings;
//     const globals = await streamDeck.settings.getGlobalSettings();

//     const tipo = settings.speed as "pan" | "zoom" | "focus";

//     if (!["pan", "zoom", "focus"].includes(tipo)) {
//       await ev.action.setTitle("Selecione um tipo");
//       return;
//     }

//     await ev.action.setTitle(`${tipo === 'pan' ? 'P/T' : tipo}: ${globals[`${tipo}Level`] ?? ' 1 ' }`);
//   }
  
//   override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PTZSpeedProps>){
//     const settings = ev.payload.settings;

//     const tipo = settings.speed as "pan" | "zoom" | "focus";

//     if (!["pan", "zoom", "focus"].includes(tipo)) {
//       await ev.action.setTitle("Selecione um tipo");
//       return;
//     }

//     // Pega os valores globais atuais
//     const globals = await streamDeck.settings.getGlobalSettings();

//     // Atualiza o título do botão
//     await ev.action.setTitle(`${tipo === 'pan' ? 'P/T' : tipo}: ${globals[`${tipo}Level`] ?? '1' }`);
//   }

//     //KEYDOWN
//   override async onKeyDown(ev: KeyDownEvent<PTZSpeedProps>): Promise<void> {
    
//     const settings = ev.payload.settings;

//     const tipo = settings.speed as "pan" | "zoom" | "focus";

//     if (!["pan", "zoom", "focus"].includes(tipo)) {
//       await ev.action.setTitle("Selecione um tipo");
//       return;
//     }

//     // Pega os valores globais atuais
//     const globals = await streamDeck.settings.getGlobalSettings();

//     // Converte o level atual para número (com fallback para 1)
//     let levelAtual = Number(globals[`${tipo}Level`] ?? 1);
//     if (isNaN(levelAtual) || levelAtual < 1 || levelAtual > 10) {
//       levelAtual = 1;
//     }

//     // Atualiza o level com loop de 1 a 10
//     levelAtual++;
//     if (levelAtual > 10) levelAtual = 1;

//     // Calcula a velocidade com base no level
//     const maxValue = PTZSpeed.maxValues[tipo]; // 24, 7, 7
//     const calculado = Math.round((levelAtual / 10) * maxValue);

//     // Atualiza o título do botão
//     await ev.action.setTitle(`${tipo === 'pan' ? 'P/T' : tipo}: ${levelAtual}`);

//     // Atualiza os globals com a nova velocidade e level
//     await streamDeck.settings.setGlobalSettings({
//       ...globals,
//       [`${tipo}Speed`]: calculado,
//       [`${tipo}Level`]: levelAtual,
//     });
//   }
// }





// @action({ UUID: "com.neoid.ptzneoid.ptz-speed" })
// export class PTZSpeed extends SingletonAction{
//   static speedLevel = 1;
//   static readonly maxLevel = 10;
//   static readonly minLevel = 1;
//   private static readonly maxValues: PTZConfig = {
//     pan: 24,
//     zoom: 7,
//     focus: 7,
//   };
//   static level = {
//     pan: 1,
//     zoom: 1,
//     focus: 1,
//   };
  

//   override async onWillAppear(ev: WillAppearEvent<PTZSpeedProps>) {
//     const settings = ev.payload.settings;
//     const globals = await streamDeck.settings.getGlobalSettings();

//     const tipo = settings.speed as "pan" | "zoom" | "focus";

//     if (!["pan", "zoom", "focus"].includes(tipo)) {
//       await ev.action.setTitle("Selecione um tipo");
//       return;
//     }

//     await ev.action.setTitle(`${tipo === 'pan' ? 'P/T' : tipo}: ${globals[`${tipo}Level`] ?? ' 1 ' }`);
//   }
  
//   override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PTZSpeedProps>){
//     const settings = ev.payload.settings;

//     const tipo = settings.speed as "pan" | "zoom" | "focus";

//     if (!["pan", "zoom", "focus"].includes(tipo)) {
//       await ev.action.setTitle("Selecione um tipo");
//       return;
//     }

//     // Pega os valores globais atuais
//     const globals = await streamDeck.settings.getGlobalSettings();

//     // Atualiza o título do botão
//     await ev.action.setTitle(`${tipo === 'pan' ? 'P/T' : tipo}: ${globals[`${tipo}Level`] ?? '1' }`);
//   }

//     //KEYDOWN
//   override async onKeyDown(ev: KeyDownEvent<PTZSpeedProps>): Promise<void> {
    
//     const settings = ev.payload.settings;

//     const tipo = settings.speed as "pan" | "zoom" | "focus";

//     if (!["pan", "zoom", "focus"].includes(tipo)) {
//       await ev.action.setTitle("Selecione um tipo");
//       return;
//     }

//     // Pega os valores globais atuais
//     const globals = await streamDeck.settings.getGlobalSettings();

//     // Converte o level atual para número (com fallback para 1)
//     let levelAtual = Number(globals[`${tipo}Level`] ?? 1);
//     if (isNaN(levelAtual) || levelAtual < 1 || levelAtual > 10) {
//       levelAtual = 1;
//     }

//     // Atualiza o level com loop de 1 a 10
//     levelAtual++;
//     if (levelAtual > 10) levelAtual = 1;

//     // Calcula a velocidade com base no level
//     const maxValue = PTZSpeed.maxValues[tipo]; // 24, 7, 7
//     const calculado = Math.round((levelAtual / 10) * maxValue);

//     // Atualiza o título do botão
//     await ev.action.setTitle(`${tipo === 'pan' ? 'P/T' : tipo}: ${levelAtual}`);

//     // Atualiza os globals com a nova velocidade e level
//     await streamDeck.settings.setGlobalSettings({
//       ...globals,
//       [`${tipo}Speed`]: calculado,
//       [`${tipo}Level`]: levelAtual,
//     });
//   }
// }


@action({ UUID: "com.neoid.ptzneoid.ptz-speed" })
export class PTZSpeed extends SingletonAction {
  private static readonly speedModes = ["slowest", "slow", "normal", "fast", "fastest"] as const;
  private static readonly modeValues: Record<typeof PTZSpeed.speedModes[number], number> = {
    slowest: 2,
    slow: 3,
    normal: 5,
    fast: 7,
    fastest: 9,
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
      await ev.action.setTitle("Selecione um tipo");
      return;
    }

    const currentMode = globals[`${tipo}Mode`] ?? "normal";
    await ev.action.setTitle(`${tipo === "pan" ? "P/T" : tipo}:\n${currentMode}`);
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<PTZSpeedProps>) {
    const settings = ev.payload.settings;
    const tipo = settings.speed as "pan" | "zoom" | "focus";

    if (!["pan", "zoom", "focus"].includes(tipo)) {
      await ev.action.setTitle("Selecione um tipo");
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
      await ev.action.setTitle("Selecione um tipo");
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

  
