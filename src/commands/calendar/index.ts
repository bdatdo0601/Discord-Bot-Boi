import { Command, CommandList } from "@commands/command.interface";
import debug from "debug";
import { Message } from "discord.js";
import { CalendarCommandKeyList } from "./calendar.interface";
import { initializeCalendar } from "./helper";
import CALENDAR_RESPONSE from "./response";

const debugLog = debug("BotBoi:CalendarCommands");

const createCalendarCommand: Command = {
  commandCallback: async (context, message: Message) => {
    try {
      const { googleAPIJWTClient, db } = context;
      await message.reply(CALENDAR_RESPONSE.INIT_CALENDAR_PENDING());
      // initialize calendar
      await initializeCalendar(message.guild, googleAPIJWTClient, db);
      await message.reply(CALENDAR_RESPONSE.INIT_CALENDAR_SUCCESS());
    } catch (err) {
      await message.reply(CALENDAR_RESPONSE.INIT_CALENDAR_FAILED());
      debugLog(err);
    }
  },
  commandDescription: "create a new calendar for the server",
};

export const calendarCommandKeyList: CalendarCommandKeyList = {
  CREATE_NEW_CALENDAR: "~initCalendar",
};

export default {
  [calendarCommandKeyList.CREATE_NEW_CALENDAR]: createCalendarCommand,
} as CommandList;
