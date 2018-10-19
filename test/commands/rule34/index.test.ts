import { expect } from "chai";
import rule34CommandList, {
  rule34CommandKeyList
} from "../../../src/commands/rule34";
import { Client, Message } from "discord.js";

describe("Rule34 Commands", () => {
  describe("Rule 34 Search Command", () => {
    const client = new Client();
    before(() => {
      client.on("message", (message: Message) => {
        rule34CommandKeyList[rule34CommandKeyList.RULE34_SEARCH](
          client,
          message.content,
          message
        );
      });
    });
    it("should send a list of lewd images", () => {});
  });
});
