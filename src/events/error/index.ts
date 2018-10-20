import { Event } from "../event.interface";
import { Client } from "discord.js";

const debug = require("debug")("BotBoi:onErrorEvent");

const error: Event = {
  eventName: "error",
  eventActionCallback: (client: Client) => async (error: Error) => {
    debug(error.message);
    debug(error);
  }
};

export default error;
