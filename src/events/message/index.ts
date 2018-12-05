import debug from "debug";
import { Client, Message } from "discord.js";
import { Event } from "../event.interface";

import commandList, { COMMANDS, processCommand } from "../../commands";

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
      } else if (message.content === "!going") {
        await commandList[
          COMMANDS.CALENDAR_EVENT.ADD_ATTENDEE_TO_EVENT
        ].commandCallback(context, message, "SNM");
        const postResponses: string[] = [];
        postResponses.push(
          "Consider using `~goingTo <eventName>` (ex: `~goingTo SNM`) next time :)",
        );
        postResponses.push("Subscribe to our calendar with `~getCalendar`");
        message.channel.send(postResponses.join("\n"));
      }
    } catch (err) {
      debugLog(err);
    }
  },
  eventName: "message",
};

export default messageEvent;
