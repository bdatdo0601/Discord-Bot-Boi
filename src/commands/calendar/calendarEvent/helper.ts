import {
  getCalendarEvents,
  quickAddCalendarEvent,
} from "@lib/api/googleapis/calendar";
import { EventSearchQuery } from "@lib/api/googleapis/calendar/calendar.interface";
import { JWT } from "google-auth-library";
import { calendar_v3 } from "googleapis";
import moment = require("moment");
import { debuglog } from "util";

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
  const startTime = event.start ? convertEventTimeToReadableString(event.start) : "unknown";
  const endTime = event.end ? convertEventTimeToReadableString(event.end) : "unknown";
  return `- **${title}** from **${startTime}** to **${endTime}** at *${location}*`;
};

export const listCalendarEvents = async (
  calendarID: string,
  jwtCredentials: JWT,
): Promise<string> => {
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
  const stringifyEventList = eventList.map((event) =>
    convertEventToReadableString(event),
  );
  return stringifyEventList.join("\n");
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
