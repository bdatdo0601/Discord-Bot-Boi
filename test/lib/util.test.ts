import { expect } from "chai";
import Util from "../../src/lib/util";

describe("getRandomElementFromArray Function", () => {
  const mockData: any[] = [[1, 2, 3], ["test", "test2", "test3"]];
  mockData.forEach((testCase) => {
    it("should return a random element within an array", () => {
      const result = Util.getRandomElementFromArray(testCase);
      expect(testCase).to.include(result);
    });
  });
  it("should return null if no array was provided", () => {
    const result = Util.getRandomElementFromArray(
      (undefined as unknown) as any,
    );
    expect(result).to.be.null;
  });
});
