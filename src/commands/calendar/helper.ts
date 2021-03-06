import {
  createNewCalendar,
  deleteCalendar,
} from "@lib/api/googleapis/calendar";
import { getGuildStore, updateGuildStore } from "@lib/db/firebase";
import { GuildStore } from "@lib/db/firebase/firebase.interface";
import { Guild } from "discord.js";
import firebase from "firebase-admin";
import { JWT } from "google-auth-library";
import CALENDAR_RESPONSE from "./response";

export const initializeCalendar = async (
  guild: Guild,
  jwtClient: JWT,
  db: firebase.database.Database,
): Promise<void> => {
  const guildStore = (await getGuildStore(guild.id, db)) as GuildStore;
  if (guildStore.data.googleStore.calendarID) {
    // delete the calendar
    await deleteCalendar(guildStore.data.googleStore.calendarID, jwtClient);
  }
  const calendar = await createNewCalendar(guild, jwtClient);
  await updateGuildStore(
    {
      data: {
        googleStore: {
          calendarID: calendar.id,
        },
      },
      guildMetadata: {
        guildID: guild.id,
      },
    },
    db,
  );
};

export const getCalendarLink = async (
  guildID: string,
  db: firebase.database.Database,
): Promise<string> => {
  const guildStore = (await getGuildStore(guildID, db)) as GuildStore;
  if (!guildStore.data.googleStore.calendarID) {
    return CALENDAR_RESPONSE.CALENDAR_NOT_FOUND();
  }
  return `https://calendar.google.com/calendar/r?cid=${
    guildStore.data.googleStore.calendarID
  }`;
};
