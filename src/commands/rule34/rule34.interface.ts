import { Command } from "../command.interface";

export interface Rule34Keyword {
  source: "rule34xxx";
  word: string;
}

export interface Rule34StoreInput {
  recurringNSFWChannelID?: string;
  rule34Keywords?: Rule34Keyword[];
}

export interface Rule34Store {
  recurringNSFWChannelID: string;
  rule34Keywords: Rule34Keyword[];
}

export interface Rule34KeywordList {
  rule34xxx: string[];
}

export interface Rule34CommandKeyList {
  RULE34_SEARCH: "~rule34";
  RULE34_SET_RECURRING: "~rule34setRecurring";
  RULE34_GET_RECURRING: "~rule34getRecurring";
  RULE34_DELETE_RECURRING: "~rule34deleteRecurring";
  RULE34_LIST: "~rule34list";
}

export interface Rule34CommandList {
  RULE34_SEARCH: Command;
  RULE34_SET_RECURRING: Command;
  RULE34_GET_RECURRING: Command;
  RULE34_DELETE_RECURRING: Command;
  RULE34_LIST: Command;
}
