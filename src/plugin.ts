import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { PTZControl } from "./actions/ptz-controls";
import { PTZZoom } from "./actions/ptz-zoom";
import { PTZFocus } from "./actions/ptz-focus";
import { PTZTracking } from "./actions/ptz-tracking";
import { PTZRegister } from "./actions/ptz-register";
import { PTZSpeed } from "./actions/pan-speed";
import { PTZRecord } from "./actions/ptz-record";
import { PTZPreset } from "./actions/preset";
import { Osd } from "./actions/osd";
import { WbMode } from "./actions/wbmode";
import { WbmodeColor } from "./actions/wbmode-color";
import { Pattern } from "./actions/pattern";
import { Aemode } from "./actions/aemode";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

// Register action.
streamDeck.actions.registerAction(new PTZControl());
streamDeck.actions.registerAction(new PTZZoom());
streamDeck.actions.registerAction(new PTZFocus());
streamDeck.actions.registerAction(new PTZTracking());
streamDeck.actions.registerAction(new PTZRegister());
streamDeck.actions.registerAction(new PTZSpeed());
streamDeck.actions.registerAction(new PTZRecord());
streamDeck.actions.registerAction(new PTZPreset());
streamDeck.actions.registerAction(new Osd());
streamDeck.actions.registerAction(new Pattern());
streamDeck.actions.registerAction(new WbMode());
streamDeck.actions.registerAction(new WbmodeColor());
streamDeck.actions.registerAction(new Aemode());

streamDeck.connect();


