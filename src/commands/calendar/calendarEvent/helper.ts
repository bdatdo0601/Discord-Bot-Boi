import {
  addAttendeeToCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvents,
  getFirstCalendarEvent,
  quickAddCalendarEvent,
  removeAttendeeFromCalendarEvent,
  updateCalendarEventLocation,
} from "@lib/api/googleapis/calendar";
import {
  EventAttendeeInput,
  EventSearchQuery,
  EventStatus,
} from "@lib/api/googleapis/calendar/calendar.interface";
import debug from "debug";
import { GuildMember, User } from "discord.js";
import { JWT } from "google-auth-library";
import { calendar_v3 } from "googleapis";
import moment = require("moment");
import response from "../response";

const debugLog = debug("BotBoi:CalendarEventCommandHelper");

// tslint:disable-next-line
const DATE_REGEX = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

const convertEventTimeToReadableString = (eventTimeObject) => {
  return eventTimeObject.dateTime
    ? moment(eventTimeObject.dateTime).format("hh:mm a MMM Do YYYY")
    : "unknown";
};

const convertEventToReadableString = (
  event: calendar_v3.Schema$Event,
): string => {
  const title = event.summary;
  const location = event.location ? event.location.trim() : "unknown";
  const startTime = event.start
    ? convertEventTimeToReadableString(event.start)
    : "unknown";
  const endTime = event.end
    ? convertEventTimeToReadableString(event.end)
    : "unknown";
  const isDelete = event.status === EventStatus.CANCELLED ? "~~" : "";
  return isDelete
    ? `- ${isDelete} ${title} from ${startTime} to ${endTime} ${isDelete}`
    : `- **${title}** from **${startTime}** to **${endTime}**`;
};

export const listCalendarEvents = async (
  calendarID: string,
  jwtCredentials: JWT,
): Promise<string> => {
  try {
    const searchQuery: EventSearchQuery = {
      timeMax: moment().add(1, "week"),
      timeMin: moment(),
    };
    const eventList = await getCalendarEvents(
      calendarID,
      jwtCredentials,
      searchQuery,
    );
    if (eventList.length === 0) {
      return "I found none";
    }
    debugLog(eventList);
    const stringifyEventList = eventList.map((event) =>
      convertEventToReadableString(event),
    );
    return stringifyEventList.join("\n");
  } catch (err) {
    debugLog(err);
    throw new Error(err.message);
  }
};

export const quickAddEventToCalendarFromQuery = async (
  calendarID: string,
  jwtCredentials: JWT,
  query: string,
): Promise<string> => {
  try {
    const event = await quickAddCalendarEvent(
      calendarID,
      jwtCredentials,
      query,
    );
    return `Created ${convertEventToReadableString(event)}`;
  } catch (err) {
    throw new Error("I don't understand your query");
  }
};

export const deleteEventFromCalendar = async (
  calendarID: string,
  jwtCredentials: JWT,
  query: string,
) => {
  try {
    const deletedEvent = await deleteCalendarEvent(
      calendarID,
      jwtCredentials,
      query,
    );
    debugLog("here");
    return `Deleted ${convertEventToReadableString(deletedEvent)}`;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const addAttendeeToEvent = async (
  calendarID: string,
  user: GuildMember,
  jwtCredentials: JWT,
  query: string,
) => {
  try {
    const newAttendee: EventAttendeeInput = {
      comment: `<@${user.id}>`,
      displayName: user.displayName,
      email: `${user.id}@${user.guild.name.replace(" ", "")}.discord`,
    };
    debugLog(newAttendee);

    const event = await addAttendeeToCalendarEvent(
      calendarID,
      newAttendee,
      jwtCredentials,
      query,
    );
    return `mark ya down as attending ${event.summary} on ${
      event.start ? convertEventTimeToReadableString(event.start) : "unknown"
    }`;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const removeAttendeeFromEvent = async (
  calendarID: string,
  user: GuildMember,
  jwtCredentials: JWT,
  query: string,
) => {
  try {
    const event = await removeAttendeeFromCalendarEvent(
      calendarID,
      user.id,
      jwtCredentials,
      query,
    );
    return `mark ya down as not attending ${event.summary} on ${
      event.start ? convertEventTimeToReadableString(event.start) : "unknown"
    }`;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getEventInfoResponse = async (
  calendarID: string,
  jwtCredentials: JWT,
  query: string,
) => {
  try {
    const event = await getFirstCalendarEvent(
      calendarID,
      jwtCredentials,
      query,
    );
    const responses: string[] = [];
    responses.push(`This is the most recent **${query}** event I found: `);
    responses.push(`**Summary**: ${convertEventToReadableString(event)}`);
    if (!event.attendees) {
      responses.push("*No one rspv'ed yet :(*");
    } else {
      responses.push(
        `**Attendees**: ${event.attendees
          .map((attendee) => attendee.displayName)
          .join(", ")}`,
      );
    }
    return responses.join("\n");
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateEventLocation = async (
  calendarID: string,
  jwtCredential: JWT,
  event: calendar_v3.Schema$Event,
  newLocation: string,
) => {
  try {
    const updatedEvent = await updateCalendarEventLocation(
      calendarID,
      jwtCredential,
      event,
      newLocation,
    );
    return `Updated ${convertEventToReadableString(updatedEvent)}`;
  } catch (err) {
    return err.message;
  }
};
