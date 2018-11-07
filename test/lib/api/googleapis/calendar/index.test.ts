import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { Guild } from "discord.js";
import { JWT } from "google-auth-library";
import { initGoogleAPIS } from "../../../../../src/lib/api/googleapis";
import {
  createNewCalendar,
  deleteCalendar,
} from "../../../../../src/lib/api/googleapis/calendar";

chai.use(chaiAsPromised);

describe("GoogleAPIS Calendar Function", async () => {
  let jwtClient: JWT;
  const mockGuild = ({ id: "foo", name: "bar" } as unknown) as Guild;
  beforeEach(async () => {
    jwtClient = await initGoogleAPIS();
  });
  describe("createNewCalendar", () => {
    it("should create a new calendar and return that calendar metadata", async () => {
      const actualCalendarData = await createNewCalendar(mockGuild, jwtClient);
      expect(actualCalendarData.summary).to.eql(
        `${mockGuild.name} <ID: ${mockGuild.id}> Calendar`,
      );
    });
    it("should throw error if one occur", async () => {
      await expect(
        createNewCalendar(({} as unknown) as Guild, ({} as unknown) as JWT),
      ).to.eventually.be.rejected;
    });
  });
  describe("deleteCalendar", () => {
    let deletingCalendarID: string;
    before(async () => {
      deletingCalendarID = (await createNewCalendar(mockGuild, jwtClient))
        .id as string;
    });
    it("should delete calendar", async () => {
      await expect(deleteCalendar(deletingCalendarID, jwtClient)).to.eventually
        .be.fulfilled;
    });
    it("should throw error if one occurs", async () => {
      await expect(deleteCalendar("", ({} as unknown) as JWT)).to.eventually.be
        .rejected;
    });
  });
});
