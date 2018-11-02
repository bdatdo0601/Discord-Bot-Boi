import { Attachment } from "discord.js";

export interface MockCommandKeyList {
  MOCK: "~mock";
  SAY_MOCK: "~sayMock";
}

export interface MockResponse {
  message: string;
  attachment: Attachment;
}
