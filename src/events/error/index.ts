import debug from "debug";
import { Client } from "discord.js";
import { Event } from "../event.interface";

const debugLog = debug("BotBoi:onErrorEvent");

const errorEvent: Event = {
  eventActionCallback: (client: Client) => async (error: Error) => {
    debugLog(error.message);
    debugLog(error);
  },
  eventName: "error",
};

export default errorEvent;
