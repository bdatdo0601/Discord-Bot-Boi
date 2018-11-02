import { expect } from "chai";
import { Client, Message } from "discord.js";

import firebase from "firebase";
import fb from "firebase-admin";

import { FIREBASE_CONFIG } from "../../../src/config";
import messageEvent from "../../../src/events/message";

describe("Message Event", () => {
  // firebase initialization
  const app = firebase.initializeApp(FIREBASE_CONFIG, "messageEventTestEnv");
  const FireDB = (app.database() as unknown) as fb.database.Database;
  let client: Client;
  beforeEach(() => {
    client = new Client();
  });
  before(async () => {
    await FireDB.goOnline();
  });
  it("should trigger when a message event arrive", (done) => {
    const mockMessage = {
      author: {
        bot: false,
      },
      content: "test",
      send: (result) => {
        expect(result).to.be.a("string");
      },
    };
    client.on(messageEvent.eventName, (message) => {
      messageEvent.eventActionCallback({ client, db: FireDB })(message);
      done();
    });
    client.emit(messageEvent.eventName, mockMessage);
  });
  it("should process command when a command arrive", async () => {
    const mockMessage = {
      author: {
        bot: false,
      },
      content: "~sayMock test",
      send: (result) => {
        expect(result).to.be.a("string");
      },
    };
    await messageEvent.eventActionCallback({ client, db: FireDB })(
      (mockMessage as unknown) as Message,
    );
  });
  it("should ignore command when invalid command arrive", async () => {
    const mockMessage = {
      author: {
        bot: false,
      },
      content: "~sayMsafasock test",
      send: (result) => {
        expect(result).to.be.a("string");
      },
    };
    await messageEvent.eventActionCallback({ client, db: FireDB })(
      (mockMessage as unknown) as Message,
    );
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
    await messageEvent.eventActionCallback({ client, db: FireDB })(
      (mockMessage as unknown) as Message,
    );
  });
  it("should do nothing if an error occured", async () => {
    const mockMessage = {};
    await messageEvent.eventActionCallback({ client, db: FireDB })(
      (mockMessage as unknown) as Message,
    );
  });
  afterEach(async () => {
    await client.destroy();
  });
  after(async () => {
    await FireDB.goOffline();
    await app.delete();
  });
});
