import { Client } from "discord.js";
import firebase, { ServiceAccount } from "firebase-admin";
import { FIREBASE_CONFIG, GOOGLE_CONFIG } from "../../../src/config";
import errorEvent from "../../../src/events/error";
import { EventContext } from "../../../src/events/event.interface";

describe("Error Event", () => {
  // firebase initialization
  const app = firebase.initializeApp(
    {
      credential: firebase.credential.cert(GOOGLE_CONFIG as ServiceAccount),
      databaseURL: FIREBASE_CONFIG.databaseURL,
    },
    "ErrorEventTestEnv",
  );
  const FireDB = app.database();
  const client = new Client();
  before(async () => {
    await FireDB.goOnline();
    await FireDB.ref("/").remove();
  });
  it("should trigger when error event got emitted", (done) => {
    client.on(errorEvent.eventName, (error: Error) => {
      errorEvent.eventActionCallback(({
        client,
        db: FireDB,
      } as unknown) as EventContext)(error);
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
