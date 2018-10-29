export interface VoteOptions {
  [key: string]: number;
}

export interface VoteResult {
  key: string;
  value: number;
}

export interface ReferendumCommandKeyList {
  REFERENDUM_POLL: "~poll";
  REFERENDUM_VOTE: "~vote";
  REFERENDUM_TALLY: "~tally";
}
