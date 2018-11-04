import { User } from "discord.js";
import _ from "lodash";
import { VoteOptions, VoteResult } from "./referendum.interface";

/**
 * check if user is already voted
 *
 * @param {User} user user to be checked
 * @param {string[]} voted vote list
 *
 * @returns {boolean} whether or not user has already voted
 */
export const hasVoted = (user: User, voted: string[]): boolean => {
  // has user voted?
  return _.includes(voted, user.username + user.discriminator);
};

/**
 * check whether or not a poll is in session
 *
 * @param {VoteOptions} votes list of vote options
 *
 * @returns {boolean} whether or not a poll is in a running
 */
export const isPoll = (votes: VoteOptions): boolean => {
  // is there a poll going on?
  return Object.keys(votes).length > 0;
};

/**
 * initialize vote options from a candidate list
 *
 * @param {string} query list of candidate as string separated by comma
 * @param {VoteOptions} votes vote storage
 *
 * @returns a list of candidate
 */
export const initVoteOptions = (
  query: string,
  votes: VoteOptions,
): string[] => {
  const args = query.split(","); // candidates should be separated by commas
  _.each(args, (candidate: string) => {
    candidate = _.trim(candidate);
    votes[candidate] = 0;
  });
  return args;
};

/**
 * generate response from initializing poll
 *
 * @param {string} userID ID of user that initiating the poll
 * @param candidateList list of voting candidates
 *
 * @returns {string} response to send to user
 */
export const getPollResponse = (
  userID: string,
  candidateList: string[],
): string => {
  const responses: string[] = [];
  responses.push(`<@${userID}> started a poll!`);
  responses.push(`Your choices are [ **${candidateList.join(" ")}** ].`);
  return responses.join("\n");
};

/**
 * register vote from an user
 *
 * @param {User} user user that vote
 * @param {string} query option that user voted on
 * @param {string[]} voted list of already voted users
 * @param {VoteOptions} votes list of vote options
 *
 * @returns {string} response to confirm user has voted
 */
export const registerVote = (
  user: User,
  query: string,
  voted: string[],
  votes: VoteOptions,
): string => {
  votes[query] += 1;
  voted.push(user.username + user.discriminator);
  return `${user.username} voted for ${query}!`;
};

/**
 * get poll result from vote data
 *
 * @param {VoteOptions} votes vote data
 *
 * @returns {VoteResult[]} the vote result for each vote option sorted ascendingly
 */
export const getPollResult = (votes: VoteOptions): VoteResult[] => {
  return _.sortBy(
    Object.keys(votes).map((key) => ({
      key,
      value: votes[key],
    })),
    (obj) => {
      return obj.value;
    },
  );
};

/**
 * get response to display result to users
 *
 * @param {VoteResult[]} voteResults vote result sorted ascendingly
 *
 * @returns {string} response for users
 */
export const getTallyResponse = (voteResults: VoteResult[]): string => {
  const responses: string[] = [];
  const winner = voteResults.pop() as VoteResult; // sorted ascending, winner at end
  _.each(voteResults, (obj: any) => {
    responses.push(`${obj.key} had ${obj.value} votes.`);
  });
  responses.push(
    `The winner is **${winner.key}** with **${winner.value} vote(s)**!`,
  );
  return responses.join("\n");
};

/**
 * clear current vote data
 *
 * @param {VoteOptions} votes vote data
 * @param {string[]} voted voted user list
 */
export const clearCurrentPollData = (
  votes: VoteOptions,
  voted: string[],
): void => {
  // clear the object while keeping its immutability
  for (const voteOption of Object.keys(votes)) {
    delete votes[voteOption];
  }
  voted.length = 0; // clear the array while keeping its immutability
};
