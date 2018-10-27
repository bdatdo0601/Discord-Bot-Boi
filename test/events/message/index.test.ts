import { expect } from "chai";
import {
  Client,
  Collection,
  Guild,
  Message,
  TextChannel,
  User,
} from "discord.js";
import dotenv from "dotenv";
import firebase from "firebase";
import messageEvent from "../../../src/events/message";
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

describe("Message Event", () => {
  // firebase initialization
  const app = firebase.initializeApp(firebaseConfig, "messageEventTestEnv");
  const FireDB = app.database();
  let client: Client;
  beforeEach(() => {
    client = new Client();
  });
  before(async () => {
    await FireDB.goOnline();
  });
  it("should trigger when a message event arrive", (done) => {
    const testUser = new User(client, { id: 1, bot: false });
    const testMessage = new Message(
      new TextChannel(new Guild(client, { emojis: new Collection() }), {}),
      {
        attachments: new Collection(),
        author: testUser,
        content: "test yolo",
        embeds: [],
      },
      client,
    );
    client.on(messageEvent.eventName, (message) => {
      messageEvent.eventActionCallback(client, FireDB)(message);
      done();
    });
    client.emit(messageEvent.eventName, testMessage);
  });
  it("should process command when a command arrive", (done) => {
    const testUser = new User(client, { id: 1 });
    const testValidCommandMessage = new Message(
      new TextChannel(new Guild(client, { emojis: new Collection() }), {}),
      {
        attachments: new Collection(),
        author: testUser,
        content: "~mock",
        embeds: [],
      },
      client,
    );
    client.on(messageEvent.eventName, (message) => {
      messageEvent
        .eventActionCallback(client, FireDB)(message)
        .then(() => {
          done();
        });
    });
    client.emit(messageEvent.eventName, testValidCommandMessage);
  });
  it("should ignore command when invalid command arrive", (done) => {
    const testUser = new User(client, { id: 1, bot: true });
    const testInvalidCommandMessage = new Message(
      new TextChannel(new Guild(client, { emojis: new Collection() }), {}),
      {
        attachments: new Collection(),
        author: { ...testUser, bot: true },
        content: "~mocasfk",
        embeds: [],
      },
      client,
    );
    client.on(messageEvent.eventName, (message) => {
      messageEvent
        .eventActionCallback(client, FireDB)(message)
        .then(() => {
          done();
        });
    });
    client.emit(messageEvent.eventName, testInvalidCommandMessage);
  });
  it("should ignore bot message when it arrive", (done) => {
    const testUser = new User(client, { id: 1, bot: true });
    const testInvalidCommandMessage = new Message(
      new TextChannel(new Guild(client, { emojis: new Collection() }), {}),
      {
        attachments: new Collection(),
        author: { ...testUser, bot: true },
        content: "mocasfk",
        embeds: [],
      },
      client,
    );
    client.on(messageEvent.eventName, (message) => {
      messageEvent
        .eventActionCallback(client, FireDB)(message)
        .then(() => {
          done();
        });
    });
    client.emit(messageEvent.eventName, testInvalidCommandMessage);
  });
  afterEach(async () => {
    await client.destroy();
  });
  after(async () => {
    await FireDB.goOffline();
    await app.delete();
  });
});
