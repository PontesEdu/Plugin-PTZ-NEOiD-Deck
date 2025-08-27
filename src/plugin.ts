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
import { Pattern } from "./actions/pattern";
import { Aemode } from "./actions/aemode";
import { Count } from "./actions/count";
import { WbModeColor } from "./actions/color-wbmode";
import { AemodeExposure } from "./actions/exposure";
import { ImageSettings } from "./actions/image-settings";

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
streamDeck.actions.registerAction(new WbModeColor());
streamDeck.actions.registerAction(new Count());
streamDeck.actions.registerAction(new Aemode());
streamDeck.actions.registerAction(new AemodeExposure());
streamDeck.actions.registerAction(new ImageSettings());

streamDeck.connect();


