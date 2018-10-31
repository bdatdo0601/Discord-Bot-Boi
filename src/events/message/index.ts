import debug from "debug";
import { Client, Message } from "discord.js";
import { Event } from "../event.interface";

import commandList, { COMMANDS } from "../../commands";

const debugLog = debug("BotBoi:onMessageEvent");

const messageEvent: Event = {
  eventActionCallback: (context) => async (message: Message) => {
    debugLog("start message event");
    if (message.content[0] === "~") {
      const [command, ...rest] = message.content.split(" ");
      const query: string = rest.join(" ");
      if (commandList[command]) {
        await commandList[command].commandCallback(context, message, query);
      }
    }
    debugLog("finish message event");
  },
  eventName: "message",
};

export default messageEvent;
