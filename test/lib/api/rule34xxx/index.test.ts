import chai, { expect } from "chai";
import Rule34XXXAPI from "../../../../src/lib/api/rule34xxx";

chai.use(require("chai-as-promised"));

describe("getRule34XXXImgs Function", () => {
  const validMockQuery: string[] = ["", "foo", "naruto", "l;kasjflaksjf"];
  validMockQuery.forEach(testCase => {
    it("should return an array of object with urls and tags", async () => {
      const data = await Rule34XXXAPI.getRule34XXXImgs(testCase);
      expect(data).to.be.an("array");
      data.forEach(imageData => {
        expect(imageData.url).to.be.a("string");
        expect(imageData.tags).to.be.an("array");
      });
    });
  });
});
