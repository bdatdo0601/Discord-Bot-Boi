import { expect } from "chai";
import { Client, ClientUser, Message } from "discord.js";

import firebase, { ServiceAccount } from "firebase-admin";

import { FIREBASE_CONFIG, GOOGLE_CONFIG } from "../../../src/config";
import { EventContext } from "../../../src/events/event.interface";
import messageEvent from "../../../src/events/message";

describe("Message Event", () => {
  // firebase initialization
  const app = firebase.initializeApp(
    {
      credential: firebase.credential.cert(GOOGLE_CONFIG as ServiceAccount),
      databaseURL: FIREBASE_CONFIG.databaseURL,
    },
    "MessageEventTestEnv",
  );
  const FireDB = app.database();
  let client: Client;
  beforeEach(() => {
    client = new Client();
  });
  before(async () => {
    await FireDB.goOnline();
  });
  it("should trigger when a message event arrive", async () => {
    const mockMessage = {
      author: {
        bot: false,
      },
      content: "test",
      send: (result) => {
        expect(result).to.be.a("string");
      },
    };
    await messageEvent.eventActionCallback(({
      client: { user: { id: "foo" } },
      db: FireDB,
    } as unknown) as EventContext)((mockMessage as unknown) as Message);
  });

  it("should ignore bot message when it arrive", async () => {
    const mockMessage = {
      author: {
        bot: true,
      },
      content: "~sayMoasfck test",
      send: (result) => {
        expect(result).to.be.a("string");
      },
    };
    await messageEvent.eventActionCallback(({
      client,
      db: FireDB,
    } as unknown) as EventContext)((mockMessage as unknown) as Message);
  });
  it("should call process command if first character is `~`", async () => {
    const mockMessage = {
      author: {
        bot: false,
      },
      content: "~sayMoasfck test",
      send: (result) => {
        expect(result).to.be.a("string");
      },
    };
    await messageEvent.eventActionCallback(({
      client: { user: { id: "foo" } },
      db: FireDB,
    } as unknown) as EventContext)((mockMessage as unknown) as Message);
  });
  it("should call dialogflow process if message start with client userID", async () => {
    const mockMessage = {
      author: {
        bot: false,
      },
      content: "<@foo> test",
      send: (result) => {
        expect(result).to.be.a("string");
      },
    };
    await messageEvent.eventActionCallback(({
      client: { user: { id: "foo" } },
      db: FireDB,
    } as unknown) as EventContext)((mockMessage as unknown) as Message);
  });
  it("should do nothing if an error occured", async () => {
    const mockMessage = {};
    await messageEvent.eventActionCallback(({
      client,
      db: FireDB,
    } as unknown) as EventContext)((mockMessage as unknown) as Message);
  });
  afterEach(async () => {
    await client.destroy();
  });
  after(async () => {
    await FireDB.goOffline();
    await app.delete();
  });
});
