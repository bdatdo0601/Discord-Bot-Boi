import chai, { expect } from "chai";
import { getMockImage } from "../../../../src/lib/api/spongeBobMock";

describe("getMockImage Function", () => {
  const validMockQuery: string[] = ["foo"];
  validMockQuery.forEach((testCase) => {
    it("should return an arraybuffer of the image mock", async () => {
      const data = await getMockImage(testCase);
      expect(data).to.be.instanceOf(Buffer);
    });
  });
});
