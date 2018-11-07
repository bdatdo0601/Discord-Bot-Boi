import { JWT } from "google-auth-library";
import { calendar_v3, google } from "googleapis";
import { debuglog } from "util";

/**
 * Create a new calendar for a guild based on its guildID
 *
 * @param jwtCredential jwt credential for google api
 * @param guildID guild id to create new calendar
 */
export const createNewCalendar = async (
  jwtCredential: JWT,
  guildID: string,
): Promise<calendar_v3.Schema$Calendar> => {
  debuglog("creating calendar");
  const calendarAPI = google.calendar("v3");
  const response = await calendarAPI.calendars.insert({
    auth: jwtCredential,
    requestBody: {
      summary: `Calendar for guild ${guildID}`,
    },
  });
  return response.data;
};
