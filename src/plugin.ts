import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { PTZDown, PTZLeft, PTZRight, PTZUp } from "./actions/ptz-action";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

// Register action.
streamDeck.actions.registerAction(new PTZUp());
streamDeck.actions.registerAction(new PTZDown());
streamDeck.actions.registerAction(new PTZLeft());
streamDeck.actions.registerAction(new PTZRight());

streamDeck.connect();


