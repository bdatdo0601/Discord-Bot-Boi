import debug from "debug";
import { Message } from "discord.js";
import _ from "lodash";
import { Command } from "../command.interface";
import {
  clearCurrentPollData,
  getPollResponse,
  getPollResult,
  getTallyResponse,
  hasVoted,
  initVoteOptions,
  isPoll,
  registerVote,
} from "./helper";
import {
  ReferendumCommandKeyList,
  VoteOptions,
  VoteResult,
} from "./referendum.interface";
import REFERENDUM_RESPONSE from "./response";

const debugLog = debug("BotBoi:Referendum");

// only one poll at a time
const voted: string[] = [];
const votes: VoteOptions = {};

const pollValidation = async (message: Message): Promise<void> => {
  if (!isPoll(votes)) {
    // vote already in progress
    await message.reply(REFERENDUM_RESPONSE.POLL_NOT_CREATED());
    throw new Error(REFERENDUM_RESPONSE.POLL_NOT_CREATED());
  }
};

const poll: Command = {
  // starts vote, must supply options
  commandCallback: async (context, message: Message, query: string) => {
    try {
      if (isPoll(votes)) {
        // vote already in progress
        await message.reply(REFERENDUM_RESPONSE.POLL_ALREADY_EXIST());
        return;
      }
      const candidateList = initVoteOptions(query, votes);
      await message.channel.send(
        getPollResponse(message.author.id, candidateList),
      );
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription:
    "starts vote, must supply candidates to be voted on separated by comma (`,`)",
};

const vote: Command = {
  commandCallback: async (context, message: Message, query: string) => {
    try {
      pollValidation(message);
      const voteOption = _.trim(query);
      if (hasVoted(message.author, voted)) {
        await message.reply(REFERENDUM_RESPONSE.ALREADY_VOTED());
        return;
      }
      if (_.isUndefined(votes[voteOption])) {
        await message.reply(REFERENDUM_RESPONSE.INVALID_QUERY(query));
        return;
      }
      const response = registerVote(message.author, voteOption, voted, votes);
      await message.channel.send(response);
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "votes for a single candidate. only one vote per poll",
};

const tally: Command = {
  commandCallback: async (context, message: Message) => {
    try {
      pollValidation(message);
      // maps the votes object properties to objects
      const voteResults: VoteResult[] = getPollResult(votes);
      await message.channel.send(getTallyResponse(voteResults));
      clearCurrentPollData(votes, voted);
    } catch (err) {
      debugLog(err);
    }
  },
  commandDescription: "tallies votes and resets everything",
};

export const referendumCommandKeyList: ReferendumCommandKeyList = {
  REFERENDUM_POLL: "~poll",
  REFERENDUM_TALLY: "~tally",
  REFERENDUM_VOTE: "~vote",
};

export default {
  [referendumCommandKeyList.REFERENDUM_POLL]: poll,
  [referendumCommandKeyList.REFERENDUM_TALLY]: tally,
  [referendumCommandKeyList.REFERENDUM_VOTE]: vote,
};
