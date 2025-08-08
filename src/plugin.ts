import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { PTZControl } from "./actions/ptz-action";
import { PTZZoom } from "./actions/ptz-zoom";
import { PTZFocus } from "./actions/ptz-focus";
import { PTZTracking } from "./actions/ptz-tracking";
import { PTZRegister } from "./actions/ptz-register";
import { PtzExposure } from "./actions/ptz-exposure";
import { PTZSpeed } from "./actions/pan-speed";
import { PTZRecord } from "./actions/ptz-record";
import { PTZPreset } from "./actions/preset";
import { PTZSet } from "./actions/set-action";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

// Register action.
streamDeck.actions.registerAction(new PTZControl());
streamDeck.actions.registerAction(new PTZZoom());
streamDeck.actions.registerAction(new PTZFocus());
streamDeck.actions.registerAction(new PTZTracking());
streamDeck.actions.registerAction(new PTZRegister());
streamDeck.actions.registerAction(new PtzExposure());
streamDeck.actions.registerAction(new PTZSpeed());
streamDeck.actions.registerAction(new PTZRecord());
streamDeck.actions.registerAction(new PTZPreset());
streamDeck.actions.registerAction(new PTZSet());

streamDeck.connect();


