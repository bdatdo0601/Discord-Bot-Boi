import { expect } from "chai";
import { Message } from "discord.js";
import _ from "lodash";
import commandList, { COMMANDS } from "../../src/commands";

describe("Command List Wrapper", () => {
  describe("General Command", () => {
    const response: string[] = [];
    for (const commandType of Object.keys(COMMANDS)) {
      response.push(`**${_.capitalize(commandType)}**`);
      for (const command of Object.keys(COMMANDS[commandType])) {
        response.push(
          ` \`${COMMANDS[commandType][command]}\`:   ${
            commandList[COMMANDS[commandType][command]].commandDescription
          }`,
        );
      }
    }
    it("~help should return a list of all available command", async () => {
      const mockMessage = {
        channel: {
          send: (result) => {
            expect(result).to.be.eql(response.join("\n"));
          },
        },
      };
      commandList[COMMANDS.GENERAL.LIST_COMMAND].commandCallback(
        {},
        {},
        "",
        mockMessage,
      );
    });
  });
  it("should return an object", () => {
    expect(COMMANDS).to.be.an("object");
    expect(commandList).to.be.an("object");
  });
});
