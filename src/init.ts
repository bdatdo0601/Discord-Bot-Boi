import MyJSONAPI from "./lib/api/myJson";
import dotenv from "dotenv";
dotenv.config();

const debug = require("debug")("BotBoi:Main");

const initialize = async (): Promise<void> => {
  await MyJSONAPI.initBaseStore();
};

initialize().catch((error: Error) => {
  debug("Initialize fail!!");
  debug(error.message);
  debug(error);
});

export default initialize;
