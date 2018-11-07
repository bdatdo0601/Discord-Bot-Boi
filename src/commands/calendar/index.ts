import { Command, CommandList } from "@commands/command.interface";
import { createNewCalendar } from "@lib/api/googleapis/calendar";
import { updateGuildStore } from "@lib/db/firebase";
import debug from "debug";
import { Message } from "discord.js";
import { CalendarCommandKeyList } from "./calendar.interface";

const debugLog = debug("BotBoi:CalendarCommands");

const createCalendarCommand: Command = {
  commandCallback: async (context, message: Message) => {
    try {
      const { googleAPIJWTClient, db } = context;
      // create calendar command
      const calendar = await createNewCalendar(
        googleAPIJWTClient,
        message.guild.id,
      );
      if (calendar.id) {
        await updateGuildStore(
          {
            data: {
              googleStore: {
                calendarID: calendar.id,
              },
            },
            guildMetadata: {
              guildID: message.guild.id,
            },
          },
          db,
        );
        message.reply(`Calendar is initialized`);
        return;
      }
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "create a new calendar for the server",
};

export const calendarCommandKeyList: CalendarCommandKeyList = {
  CREATE_NEW_CALENDAR: "~createCalendar",
};

export default {
  [calendarCommandKeyList.CREATE_NEW_CALENDAR]: createCalendarCommand,
} as CommandList;
