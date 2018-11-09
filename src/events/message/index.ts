import debug from "debug";
import { Client, Message } from "discord.js";
import { Event } from "../event.interface";

import { processCommand } from "../../commands";

const debugLog = debug("BotBoi:onMessageEvent");

const messageEvent: Event = {
  eventActionCallback: (context) => async (message: Message) => {
    try {
      if (message.author.bot) {
        return;
      }
      const selfID = context.client.user.id;
      if (message.content.startsWith(`<@${selfID}>`)) {
        await context.dialogFlow.processMessage(context, message);
      } else if (message.content[0] === "~") {
        await processCommand(context, message);
      }
    } catch (err) {
      debugLog(err);
    }
  },
  eventName: "message",
};

export default messageEvent;
