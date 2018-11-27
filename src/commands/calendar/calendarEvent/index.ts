import { Command, CommandList } from "@commands/command.interface";
import { EventContext } from "@events/event.interface";
import { getGuildStore } from "@lib/db/firebase";
import { GuildStore } from "@lib/db/firebase/firebase.interface";
import debug from "debug";
import { Message } from "discord.js";
// import { getCalendarLink, initializeCalendar } from "./helper";
import CALENDAR_RESPONSE from "../response";
import { CalendarEventCommandKeyList } from "./calendarEvent.interface";
import { listCalendarEvents, quickAddEventToCalendarFromQuery } from "./helper";
import CALENDAR_EVENT_RESPONSE from "./response";

const debugLog = debug("BotBoi:CalendarEventCommand");

/**
 * validate to ensure calendar event's pre-requirement
 *
 * @param {EventContext} context current context of the message
 * @param {Message} message current message
 *
 * @returns {Promise<string>} eventually return calendar ID of the server
 */
const calendarEventValidation = async (
  context: EventContext,
  message: Message,
): Promise<string> => {
  const guildStore = (await getGuildStore(
    message.guild.id,
    context.db,
  )) as GuildStore;
  if (!guildStore.data.googleStore.calendarID) {
    throw new Error(CALENDAR_RESPONSE.CALENDAR_NOT_FOUND());
  }
  return guildStore.data.googleStore.calendarID;
};

const listCalendarEventCommand: Command = {
  commandCallback: async (context, message: Message) => {
    try {
      const calendarID = await calendarEventValidation(context, message);
      const response = await listCalendarEvents(
        calendarID,
        context.googleAPIJWTClient,
      );
      message.reply(CALENDAR_EVENT_RESPONSE.LIST_CALENDAR_EVENT(response));
    } catch (err) {
      message.reply(err.message);
      debugLog(err);
    }
  },
  commandDescription: "return the server's event within a week",
};

const addCalendarEventCommand: Command = {
  commandCallback: async (context, message: Message, query: string) => {
    try {
      const calendarID = await calendarEventValidation(context, message);
      const response = await quickAddEventToCalendarFromQuery(
        calendarID,
        context.googleAPIJWTClient,
        query,
      );
      message.reply(response);
    } catch (err) {
      message.reply(err.message);
      debugLog(err);
    }
  },
  commandDescription: "add an event to the calendar",
};

export const calendarEventCommandKeyList: CalendarEventCommandKeyList = {
  CREATE_NEW_EVENT: "~createEvent",
  LIST_EVENT: "~listEvent",
};

export default {
  [calendarEventCommandKeyList.LIST_EVENT]: listCalendarEventCommand,
  [calendarEventCommandKeyList.CREATE_NEW_EVENT]: addCalendarEventCommand,
} as CommandList;
