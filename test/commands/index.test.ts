import { expect } from "chai";
import commandList from "../../src/commands";

describe("Command List Wrapper", () => {
  it("should return an object", () => {
    expect(commandList).to.be.an("object");
  });
});
