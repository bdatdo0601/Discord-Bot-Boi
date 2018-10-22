import mockCommandList, { mockCommandKeyList } from "./mock";
import rule34CommandList, { rule34CommandKeyList } from "./rule34";

export const COMMANDS = {
  MOCK: mockCommandKeyList,
  RULE34: rule34CommandKeyList,
};

export default {
  ...mockCommandList,
  ...rule34CommandList,
};
