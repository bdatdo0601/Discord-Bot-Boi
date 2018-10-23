import debug from "debug";
import { Client, Message } from "discord.js";
import { Event } from "../event.interface";

import commandList, { COMMANDS } from "../../commands";

const debugLog = debug("BotBoi:onMessageEvent");

const messageEvent: Event = {
  eventActionCallback: (client: Client) => async (message: Message) => {
    if (message.content[0] === "~") {
      const [command, ...rest] = message.content.split(" ");
      const query: string = rest.join(" ");
      if (commandList[command]) {
        commandList[command].commandCallback(client, query, message);
      }
    } else if (!message.author.bot) {
      commandList[COMMANDS.WIT_AI.EVAL].commandCallback(
        client,
        message.content,
        message,
      );
    }
  },
  eventName: "message",
};

export default messageEvent;
