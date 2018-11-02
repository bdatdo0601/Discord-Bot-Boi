import { expect } from "chai";
import { Client } from "discord.js";
import firebase from "firebase";
import { FIREBASE_CONFIG } from "../../../src/config";
import errorEvent from "../../../src/events/error";

describe("Error Event", () => {
  // firebase initialization
  const app = firebase.initializeApp(FIREBASE_CONFIG, "ErrorEventTestEnv");
  const FireDB = app.database();
  const client = new Client();
  before(async () => {
    await FireDB.goOnline();
  });
  it("should trigger when error event got emitted", (done) => {
    client.on(errorEvent.eventName, (error: Error) => {
      errorEvent.eventActionCallback({ client, db: FireDB })(error);
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
