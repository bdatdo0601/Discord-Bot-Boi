import rule34CommandList, { rule34CommandKeyList } from "./rule34";
import mockCommandList, { mockCommandKeyList } from "./mock";

export const COMMANDS = {
  RULE34: rule34CommandKeyList,
  MOCK: mockCommandKeyList
};

export default {
  ...rule34CommandList,
  ...mockCommandList
};
