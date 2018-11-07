import { expect } from "chai";
import { JWT } from "google-auth-library";
import { initGoogleAPIS } from "../../../../src/lib/api/googleapis";

describe("GoogleAPIS General Function", () => {
  describe("initGoogleAPIS", () => {
    it("should authorize and return a jwtClient", async () => {
      const jwtClient = await initGoogleAPIS();
      expect(jwtClient).to.be.instanceOf(JWT);
    });
  });
});
