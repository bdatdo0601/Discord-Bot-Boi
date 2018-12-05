import { Command, CommandList } from "@commands/command.interface";
import { EventContext } from "@events/event.interface";
import { getFirstCalendarEvent } from "@lib/api/googleapis/calendar";
import { getGuildStore } from "@lib/db/firebase";
import { GuildStore } from "@lib/db/firebase/firebase.interface";
import debug from "debug";
import { Message, MessageCollector } from "discord.js";
import CALENDAR_RESPONSE from "../response";
import { CalendarEventCommandKeyList } from "./calendarEvent.interface";
import {
  addAttendeeToEvent,
  deleteEventFromCalendar,
  getEventInfoResponse,
  listCalendarEvents,
  quickAddEventToCalendarFromQuery,
  removeAttendeeFromEvent,
  updateEventLocation,
} from "./helper";
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

const deleteCalendarEventCommand: Command = {
  commandCallback: async (context, message: Message, query: string) => {
    try {
      const calendarID = await calendarEventValidation(context, message);
      const response = await deleteEventFromCalendar(
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
  commandDescription: "delete most recent event match with query",
};

const addAttendeeToEventCommand: Command = {
  commandCallback: async (context, message: Message, query: string) => {
    try {
      const calendarID = await calendarEventValidation(context, message);
      const response = await addAttendeeToEvent(
        calendarID,
        message.member,
        context.googleAPIJWTClient,
        query,
      );
      message.reply(response);
    } catch (err) {
      message.reply(err.message);
      debugLog(err);
    }
  },
  commandDescription: "add yourself to an event you specified",
};

const removeAttendeeFromEventCommand: Command = {
  commandCallback: async (context, message: Message, query: string) => {
    try {
      const calendarID = await calendarEventValidation(context, message);
      const response = await removeAttendeeFromEvent(
        calendarID,
        message.member,
        context.googleAPIJWTClient,
        query,
      );
      message.reply(response);
    } catch (err) {
      message.reply(err.message);
      debugLog(err);
    }
  },
  commandDescription: "remove yourself from an event you specified",
};

const getEventInfoCommand: Command = {
  commandCallback: async (context, message: Message, query: string) => {
    try {
      const calendarID = await calendarEventValidation(context, message);
      const response = await getEventInfoResponse(
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
  commandDescription: "get detailed info about an event",
};

const eventUpdateLocationCommand: Command = {
  commandCallback: async (context, message: Message, query: string) => {
    try {
      const calendarID = await calendarEventValidation(context, message);
      const event = await getFirstCalendarEvent(
        calendarID,
        context.googleAPIJWTClient,
        query,
      );
      message.reply("What is the new event location?");
      const collector = new MessageCollector(
        message.channel,
        (msg) => msg.author.id === message.author.id,
        { time: 10000 },
      );
      collector.on("collect", async (msg) => {
        const response = await updateEventLocation(
          calendarID,
          context.googleAPIJWTClient,
          event,
          msg.cleanContent,
        );
        msg.reply(response);
        collector.emit("end");
      });
    } catch (err) {
      message.reply(err.message);
      debugLog(err);
    }
  },
  commandDescription: "update an event location",
};

export const calendarEventCommandKeyList: CalendarEventCommandKeyList = {
  ADD_ATTENDEE_TO_EVENT: "~goingTo",
  CREATE_NEW_EVENT: "~createEvent",
  DELETE_EVENT: "~deleteEvent",
  EVENT_INFO: "~event",
  EVENT_UPDATE_LOCATION: "~updateEventLocation",
  LIST_EVENT: "~listEvent",
  REMOVE_ATTENDEE_FROM_EVENT: "~notGoingTo",
};

export default {
  [calendarEventCommandKeyList.LIST_EVENT]: listCalendarEventCommand,
  [calendarEventCommandKeyList.CREATE_NEW_EVENT]: addCalendarEventCommand,
  [calendarEventCommandKeyList.DELETE_EVENT]: deleteCalendarEventCommand,
  [calendarEventCommandKeyList.ADD_ATTENDEE_TO_EVENT]: addAttendeeToEventCommand,
  [calendarEventCommandKeyList.REMOVE_ATTENDEE_FROM_EVENT]: removeAttendeeFromEventCommand,
  [calendarEventCommandKeyList.EVENT_INFO]: getEventInfoCommand,
  [calendarEventCommandKeyList.EVENT_UPDATE_LOCATION]: eventUpdateLocationCommand,
} as CommandList;
