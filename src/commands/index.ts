import mockCommandList, { mockCommandKeyList } from "./mock";
import rule34CommandList, { rule34CommandKeyList } from "./rule34";
import witAICommandList, { witAICommandKeyList } from "./witai";
import referendumCommandList, { referendumCommandKeyList} from "./referendum";

export const COMMANDS = {
  MOCK: mockCommandKeyList,
  RULE34: rule34CommandKeyList,
  WIT_AI: witAICommandKeyList,
  REFERNDUM: referendumCommandKeyList
};

export default {
  ...mockCommandList,
  ...rule34CommandList,
  ...witAICommandList,
  ...referendumCommandList
};
