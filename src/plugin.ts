import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { PTZControl } from "./actions/ptz-action";
import { PTZZoom } from "./actions/ptz-zoom";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

// Register action.
streamDeck.actions.registerAction(new PTZControl());
streamDeck.actions.registerAction(new PTZZoom());

streamDeck.connect();


