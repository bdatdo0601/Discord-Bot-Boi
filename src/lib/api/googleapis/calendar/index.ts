import debug from "debug";
import { Guild } from "discord.js";
import { JWT } from "google-auth-library";
import { calendar_v3, google } from "googleapis";
import moment, { Moment } from "moment";
import {
  AccessControlRole,
  EventInsertQuery,
  EventSearchQuery,
} from "./calendar.interface";

const debugLog = debug("BotBoi:GoogleAPIS:Calendar");

const defaultCalendarRequestBody = (
  guildName,
  guildID,
): calendar_v3.Schema$Calendar => ({
  summary: `${guildName} <ID: ${guildID}> Calendar`,
  timeZone: "America/New_York",
});

/**
 * set access control for a calendar
 *
 * @param {string} calendarID calendar ID
 * @param {AccessControlRole} role access control for calendar
 * @param {JWT} jwtCredential jwt credential for google api
 *
 * @returns {Promise<calendar_v3.Schema$AclRule>} eventually return access control rul
 */
const setAccessControl = async (
  calendarID: string,
  role: AccessControlRole,
  jwtCredential: JWT,
): Promise<calendar_v3.Schema$AclRule> => {
  const calendarAPI = google.calendar("v3");
  const response = await calendarAPI.acl.insert({
    auth: jwtCredential,
    calendarId: calendarID,
    requestBody: {
      role,
      scope: {
        type: "default",
      },
    },
  });
  return response.data;
};

/**
 * Create a new calendar for a guild based on its guildID
 *
 * @param {Guild} guild guild to create new calendar
 * @param {JWT} jwtCredential jwt credential for google api
 *
 * @returns {Promise<calendar_v3.Schema$AclRule>} eventually return new calendar
 */
export const createNewCalendar = async (
  guild: Guild,
  jwtCredential: JWT,
): Promise<calendar_v3.Schema$Calendar> => {
  debugLog("creating calendar");
  const calendarAPI = google.calendar("v3");
  const response = await calendarAPI.calendars.insert({
    auth: jwtCredential,
    requestBody: defaultCalendarRequestBody(guild.name, guild.id),
  });
  // grant writer access from anyone to calendar
  await setAccessControl(
    response.data.id as string,
    AccessControlRole.READER,
    jwtCredential,
  );
  return response.data;
};

/**
 * delete a calendar
 *
 * @param {string} calendarID calendar ID to be deleted
 * @param {Guild} guild guild that calendar belong to
 * @param {JWT} jwtCredential API credential
 *
 * @returns {Promise<calendar_v3.Schema$AclRule>} eventually return updated calendar
 */
export const deleteCalendar = async (
  calendarID: string,
  jwtCredential: JWT,
): Promise<void> => {
  debugLog("clearing a calendar");
  const calendarAPI = google.calendar("v3");
  // clear calendar
  await calendarAPI.calendars.delete({
    auth: jwtCredential,
    calendarId: calendarID,
  });
};

/**
 * get a list of calendar events based on a query
 *
 * @param {string} calendarID calendar ID
 * @param {JWT} jwtCredential authentication for API
 * @param {EventSearchQuery} searchInput filter data
 *
 * @return {calendar_v3.Schema$Event[]} list of event match the description
 */
export const getCalendarEvents = async (
  calendarID: string,
  jwtCredential: JWT,
  searchInput: EventSearchQuery,
): Promise<calendar_v3.Schema$Event[]> => {
  debugLog(getCalendarEvents);
  const calendarAPI = google.calendar("v3");
  const { stringQuery, timeMax, timeMin } = searchInput;
  // get calendar events
  const calendarEvents = await calendarAPI.events.list({
    auth: jwtCredential,
    calendarId: calendarID,
    timeMax: timeMax ? timeMax.format() : undefined,
    timeMin: timeMin ? timeMin.format() : undefined,
  });
  if (!calendarEvents.data.items) {
    return [];
  }
  if (!stringQuery) {
    return calendarEvents.data.items;
  }
  return calendarEvents.data.items.filter((event) =>
    (event.summary as string).includes(stringQuery),
  );
};

// /**
//  * insert an event to calendar
//  *
//  * @param {string} calendarID
//  * @param {JWT} jwtCredential
//  * @param {EventInsertQuery} insertEventInput
//  *
//  * @returns {calendar_v3.Schema$Event} eventually return the new event
//  */
// export const insertCalendarEvent = async (
//   calendarID: string,
//   jwtCredential: JWT,
//   insertEventInput: EventInsertQuery,
// ): Promise<calendar_v3.Schema$Event> => {
//   debugLog("insert calendar event");
//   const calendarAPI = google.calendar("v3");
//   const calendarEvent = await calendarAPI.events.insert({
//     auth: jwtCredential,
//     calendarId: calendarID,
//     requestBody: insertEventInput,
//   });
//   return calendarEvent.data;
// };

/**
 * quick add an event from text (using google api)
 *
 * @param {string} calendarID calendar ID
 * @param {JWT} jwtCredential jwt credential
 * @param {string} query textbased event creation
 *
 * @returns {calendar_v3.Schema$Event} eventually return calendar event
 */
export const quickAddCalendarEvent = async (
  calendarID: string,
  jwtCredential: JWT,
  query: string,
): Promise<calendar_v3.Schema$Event> => {
  debugLog("quick add calendar event");
  const calendarAPI = google.calendar("v3");
  const calendarEvent = await calendarAPI.events.quickAdd({
    auth: jwtCredential,
    calendarId: calendarID,
    text: query,
  });
  return calendarEvent.data;
};
