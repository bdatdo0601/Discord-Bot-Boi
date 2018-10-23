import { expect } from "chai";
import eventList from "../../src/events";

describe("Event List Wrapper", () => {
  it("should return a list", () => {
    expect(eventList).to.be.an("array");
    eventList.forEach((event) => {
      expect(event).to.be.an("object");
    });
  });
});
