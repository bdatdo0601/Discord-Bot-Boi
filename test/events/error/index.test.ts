import { expect } from "chai";
import { Client } from "discord.js";
import dotenv from "dotenv";
import firebase from "firebase";
import errorEvent from "../../../src/events/error";
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

describe("Error Event", () => {
  // firebase initialization
  const app = firebase.initializeApp(firebaseConfig, "ErrorEventTestEnv");
  const FireDB = app.database();
  const client = new Client();
  before(async () => {
    await FireDB.goOnline();
  });
  it("should trigger when error event got emitted", (done) => {
    client.on(errorEvent.eventName, (error: Error) => {
      errorEvent.eventActionCallback(client, FireDB)(error);
      done();
    });
    client.emit(errorEvent.eventName, new Error("Test Error"));
  });
  after(async () => {
    await FireDB.goOffline();
    await app.delete();
    await client.destroy();
  });
});
