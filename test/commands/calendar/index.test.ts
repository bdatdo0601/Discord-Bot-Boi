import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

import { Message } from "discord.js";
import firebase, { ServiceAccount } from "firebase-admin";
import { JWT } from "google-auth-library";
import calendarCommandList, {
  calendarCommandKeyList,
} from "../../../src/commands/calendar";
import CALENDAR_RESPONSE from "../../../src/commands/calendar/response";
import { FIREBASE_CONFIG, GOOGLE_CONFIG } from "../../../src/config";
import { EventContext } from "../../../src/events/event.interface";
import { initGoogleAPIS } from "../../../src/lib/api/googleapis";
import { initGuildStore } from "../../../src/lib/db/firebase";
chai.use(chaiAsPromised);

describe("Calendar Commands", () => {
  // firebase initialization
  const app = firebase.initializeApp(
    {
      credential: firebase.credential.cert(GOOGLE_CONFIG as ServiceAccount),
      databaseURL: FIREBASE_CONFIG.databaseURL,
    },
    "CalendarCommandTestEnv",
  );
  let jwtClient: JWT;
  const mockGuild = {
    id: "foo123",
    name: "foo123",
  };
  const db = app.database();
  before(async () => {
    jwtClient = await initGoogleAPIS();
    await initGuildStore(mockGuild.id, db);
  });
  describe("createCalendar Command", () => {
    it("should notify success if calendar is created new", async () => {
      const responses: string[] = [];
      const mockMessage = ({
        guild: mockGuild,
        reply: (result) => {
          responses.push(result);
        },
      } as unknown) as Message;
      await calendarCommandList[
        calendarCommandKeyList.CREATE_NEW_CALENDAR
      ].commandCallback(
        ({ db, googleAPIJWTClient: jwtClient } as unknown) as EventContext,
        mockMessage,
      );
      expect(responses[0]).to.eql(CALENDAR_RESPONSE.INIT_CALENDAR_PENDING());
      expect(responses[1]).to.eql(CALENDAR_RESPONSE.INIT_CALENDAR_SUCCESS());
    });
    it("should notify success if existed calendar is deleted and a new calendar is created", async () => {
      const responses: string[] = [];
      const mockMessage = ({
        guild: mockGuild,
        reply: (result) => {
          responses.push(result);
        },
      } as unknown) as Message;
      await calendarCommandList[
        calendarCommandKeyList.CREATE_NEW_CALENDAR
      ].commandCallback(
        ({ db, googleAPIJWTClient: jwtClient } as unknown) as EventContext,
        mockMessage,
      );
      expect(responses[0]).to.eql(CALENDAR_RESPONSE.INIT_CALENDAR_PENDING());
      expect(responses[1]).to.eql(CALENDAR_RESPONSE.INIT_CALENDAR_SUCCESS());
    });
    it("should notify failure if an error occur", async () => {
      const responses: string[] = [];
      const mockMessage = ({
        reply: (result) => {
          responses.push(result);
        },
      } as unknown) as Message;
      await calendarCommandList[
        calendarCommandKeyList.CREATE_NEW_CALENDAR
      ].commandCallback(({} as unknown) as EventContext, mockMessage);
      expect(responses[0]).to.eql(CALENDAR_RESPONSE.INIT_CALENDAR_PENDING());
      expect(responses[1]).to.eql(CALENDAR_RESPONSE.INIT_CALENDAR_FAILED());
    });
  });
  describe("getCalendar Command", () => {
    it("should return calendar link if guild calendar exist", async () => {
      const mockMessage = ({
        guild: mockGuild,
        reply: (result) => {
          expect(result).to.include("https://calendar.google.com/calendar/");
        },
      } as unknown) as Message;
      await calendarCommandList[
        calendarCommandKeyList.GET_CALENDAR
      ].commandCallback(({ db } as unknown) as EventContext, mockMessage);
    });
    it("should notify if no calendar exsit", async () => {
      const mockMessage = ({
        guild: {
          id: "baz",
        },
        reply: (result) => {
          expect(result).to.eql(CALENDAR_RESPONSE.CALENDAR_NOT_FOUND());
        },
      } as unknown) as Message;
      await calendarCommandList[
        calendarCommandKeyList.GET_CALENDAR
      ].commandCallback(({ db } as unknown) as EventContext, mockMessage);
    });
    it("should do nothing if an error occur", async () => {
      await calendarCommandList[
        calendarCommandKeyList.GET_CALENDAR
      ].commandCallback(
        ({} as unknown) as EventContext,
        ({} as unknown) as Message,
      );
    });
  });
  after(async () => {
    await db.ref("/").remove();
    await db.goOffline();
    await app.delete();
  });
});
