import { Command, CommandList } from "@commands/command.interface";
import debug from "debug";
import { Message } from "discord.js";
import { CalendarCommandKeyList } from "./calendar.interface";
import { getCalendarLink, initializeCalendar } from "./helper";
import CALENDAR_RESPONSE from "./response";

const debugLog = debug("BotBoi:CalendarCommands");

const createCalendarCommand: Command = {
  commandCallback: async (context, message: Message) => {
    try {
      await message.reply(CALENDAR_RESPONSE.INIT_CALENDAR_PENDING());
      const { googleAPIJWTClient, db } = context;
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

const getCalendarCommand: Command = {
  commandCallback: async (context, message: Message) => {
    try {
      const { db } = context;
      message.reply(await getCalendarLink(message.guild.id, db));
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "return the link to server's calendar",
};

export const calendarCommandKeyList: CalendarCommandKeyList = {
  CREATE_NEW_CALENDAR: "~initCalendar",
  GET_CALENDAR: "~getCalendar",
};

export default {
  [calendarCommandKeyList.CREATE_NEW_CALENDAR]: createCalendarCommand,
  [calendarCommandKeyList.GET_CALENDAR]: getCalendarCommand,
} as CommandList;
