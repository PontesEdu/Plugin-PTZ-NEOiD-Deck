// import streamDeck, { action, DidReceiveGlobalSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent, type DidReceiveSettingsEvent } from "@elgato/streamdeck";


// const TYPE_LIST = ["hue", "saturation", "colorTemp", "rgaintuning", "bgaintuning"] as const;
// type TypeColor = typeof TYPE_LIST[number];



// @action({ UUID: "com.neoid.ptzneoid.wbmodecolor" })
// export class WbModeColor extends SingletonAction {

  
//   override async onWillAppear(ev: WillAppearEvent) {
//     const globals = await streamDeck.settings.getGlobalSettings();

//     let typeColor = globals.typeColor as TypeColor | undefined;

//     if (!typeColor || !TYPE_LIST.includes(typeColor as TypeColor)) {
//       typeColor = TYPE_LIST[0]; // define o primeiro tipo como padrão
//       await streamDeck.settings.setGlobalSettings({
//         ...globals,
//         typeColor,
//       });
//     }

//     const typeValue = globals[`${typeColor}Value`] as TypeColor | undefined;

//     await ev.action.setTitle(`${typeColor}: ${typeValue}`);
//   }

  


//   override async onDidReceiveSettings(ev: DidReceiveSettingsEvent) {

//     const settings = ev.payload.settings
//     const globals = await streamDeck.settings.getGlobalSettings();

//     let typeColor = globals.typeColor as TypeColor | undefined ;
//     if (!typeColor || !TYPE_LIST.includes(typeColor as TypeColor)) {
//       typeColor = TYPE_LIST[0]; // define o primeiro tipo como padrão
//       return;
//     }

//     const typeValue = globals[`${typeColor}Value`] as TypeColor | undefined;

//     await ev.action.setTitle(`${typeColor}: ${typeValue}`);
//   }

  


//   override async onKeyDown(ev: KeyDownEvent): Promise<void> {
//     const globals = await streamDeck.settings.getGlobalSettings();

//     const current = globals.typeColor as TypeColor | undefined;
    

//     const currentIndex = current && TYPE_LIST.includes(current as TypeColor)
//       ? TYPE_LIST.indexOf(current as TypeColor)
//       : 0;

//     const nextIndex = (currentIndex + 1) % TYPE_LIST.length;
//     const newType = TYPE_LIST[nextIndex];

//     const typeValue = globals[`${newType}Value`] as TypeColor | undefined;

//     await ev.action.setTitle(`${newType}: ${typeValue}`);

//     await streamDeck.settings.setGlobalSettings({
//       ...globals,
//       typeColor: newType,
//     });
//   }
// }





