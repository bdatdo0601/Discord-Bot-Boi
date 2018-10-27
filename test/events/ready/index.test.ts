import { Client, Collection, Guild } from "discord.js";
import dotenv from "dotenv";
import firebase from "firebase";
import sinon from "sinon";
import readyEvent, { RULE34_INTERVAL } from "../../../src/events/ready";
dotenv.config();

// firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}.firebaseapp.com`,
  databaseURL: `https://${process.env.FIREBASE_DB_NAME}.firebaseio.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}.appspot.com`,
};

describe("Ready Event", () => {
  // firebase initialization
  const app = firebase.initializeApp(firebaseConfig, "readyEventTestEnv");
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
    const nonExistingGuild = new Guild(client, { emojis: new Collection() });
    nonExistingGuild.id = "2";
    guilds.set("1", existedGuild);
    guilds.set("2", nonExistingGuild);
    client.guilds = guilds;
    readyEvent
      .eventActionCallback(client, FireDB)()
      .then(() => {
        clock.tick(RULE34_INTERVAL);
        done();
      });
  });
  after(async () => {
    await clock.restore();
    await FireDB.goOffline();
    await app.delete();
    await client.destroy();
  });
});
