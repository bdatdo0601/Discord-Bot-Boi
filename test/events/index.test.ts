import chai, { expect } from "chai";
import eventList, { placeHolder } from "../../src/events";

describe("Event List Wrapper", () => {
    it("should return a list", () => {
        expect(eventList).to.be.an("array");
        expect(placeHolder()).to.equal("");
        eventList.forEach(event => {
            expect(event).to.be.an("object");
        });
    });
});
