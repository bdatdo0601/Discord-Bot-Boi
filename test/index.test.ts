import chai, { expect } from "chai";
import dotenv from "dotenv";
dotenv.config();

chai.use(require("chai-as-promised"));

const TEST_TOKEN = <string>process.env.BOT_TOKEN;

describe("Application Test", () => {
    it("should run the application and can be destroyed", async () => {});
});
