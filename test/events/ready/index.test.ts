import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { Client, Collection, Guild, GuildChannel } from "discord.js";
import firebase, { ServiceAccount } from "firebase-admin";
import sinon from "sinon";
import { FIREBASE_CONFIG, GOOGLE_CONFIG } from "../../../src/config";
import { EventContext } from "../../../src/events/event.interface";
import readyEvent, { RULE34_INTERVAL } from "../../../src/events/ready";

chai.use(chaiAsPromised);

describe("Ready Event", () => {
  // firebase initialization
  const app = firebase.initializeApp(
    {
      credential: firebase.credential.cert(GOOGLE_CONFIG as ServiceAccount),
      databaseURL: FIREBASE_CONFIG.databaseURL,
    },
    "ReadyEventTestEnv",
  );
  const FireDB = app.database();
  const client: Client = new Client();
  let clock: any;
  before(async () => {
    await FireDB.goOnline();
    await FireDB.ref("/guilds/1").set({ foo: "bar" });
    clock = sinon.useFakeTimers();
  });
  it("should trigger when ready event got emitted", (done) => {
    const guilds = new Collection<string, Guild>();
    const existedGuild = new Guild(client, { emojis: new Collection() });
    existedGuild.id = "1";
    const existedGuildChannels = new Collection<string, GuildChannel>();
    existedGuildChannels.set("1", ({
      type: "voice",
    } as unknown) as GuildChannel);
    existedGuildChannels.set("2", ({
      send: (result) => {
        expect(result).to.be.a("string");
      },
      type: "text",
    } as unknown) as GuildChannel);
    existedGuild.channels = existedGuildChannels;
    const nonExistingGuild = new Guild(client, { emojis: new Collection() });
    nonExistingGuild.id = "2";
    guilds.set("1", existedGuild);
    guilds.set("2", nonExistingGuild);
    client.guilds = guilds;
    readyEvent
      .eventActionCallback(({
        client,
        db: FireDB,
      } as unknown) as EventContext)()
      .then(() => {
        clock.tick(RULE34_INTERVAL);
        done();
      });
  });
  it("should throw error if error occured", async () => {
    await expect(
      readyEvent.eventActionCallback(({} as unknown) as EventContext)(),
    ).to.eventually.be.rejected;
  });
  after(async () => {
    await clock.restore();
    await FireDB.goOffline();
    await app.delete();
    await client.destroy();
  });
});
