import { expect } from "chai";
import errorEvent from "../../../src/events/error";
import { Client } from "discord.js";

describe("Error Event", () => {
  const client = new Client();
  it("should trigger when error event got emitted", done => {
    client.on(errorEvent.eventName, (error: Error) => {
      errorEvent.eventActionCallback(client)(error);
      done();
    });
    client.emit(errorEvent.eventName, new Error("Test Error"));
  });
});
