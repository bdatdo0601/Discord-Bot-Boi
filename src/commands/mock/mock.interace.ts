import { Command } from "../command.interface";

export interface MockCommandKeyList {
  MOCK: "~mock";
  SAY_MOCK: "~sayMock";
}

export interface MockCommandList {
  MOCK: Command;
  SAY_MOCK: Command;
}
