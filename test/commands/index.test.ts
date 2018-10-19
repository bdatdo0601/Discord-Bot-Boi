import { expect } from "chai";
import commandList, { COMMANDS } from "../../src/commands";

describe("Command List Wrapper", () => {
  it("should return an object", () => {
    expect(COMMANDS).to.be.an("object");
    expect(commandList).to.be.an("object");
  });
});
