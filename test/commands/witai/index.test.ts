import { expect } from "chai";
import { Client, Message } from "discord.js";
import witAICommand, { witAICommandKeyList } from "../../../src/commands/witai";

describe("WitAI Command", () => {
  describe("Eval Command", () => {
    const client = new Client();
    it("process through without any problem", async () => {
      await witAICommand[witAICommandKeyList.EVAL].commandCallback(
        client,
        "hello",
        ({} as unknown) as Message,
      );
    });
  });
});
