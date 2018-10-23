import debug from "debug";
import dotenv from "dotenv";
import MyJSONAPI from "./lib/api/myJson";
dotenv.config();

const debugLog = debug("BotBoi:Init");

const initialize = async (): Promise<void> => {
  await MyJSONAPI.initBaseStore();
};

initialize().catch((error: Error) => {
  debugLog("Initialize fail!!");
  debugLog(error.message);
  debugLog(error);
});

export default initialize;
