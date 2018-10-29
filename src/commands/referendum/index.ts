import { Client, Message } from "discord.js";
import firebase from "firebase";
import _ from "lodash";
import { Command } from "../command.interface";
import { hasVoted, isPoll } from "./helper";
import {
  ReferendumCommandKeyList,
  VoteOptions,
  VoteResult,
} from "./referendum.interface";
// only one poll at a time
const voted: string[] = [];
const votes: VoteOptions = {};
const poll: Command = {
  // starts vote, must supply options
  commandCallback: (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ): void => {
    if (isPoll(votes)) {
      // vote already in progress
      message.reply("You need to tally before you can start another poll");
    } else {
      const args = query.split(","); // candidates should be separated by commas
      _.each(args, (candidate: string) => {
        candidate = _.trim(candidate);
        votes[candidate] = 0;
      });
      message.channel.send(`${message.author.username} started a poll!`);
      message.channel.send(`Your choices are [ **${args.join(" ")}** ].`);
    }
  },
  commandDescription:
    "starts vote, must supply candidates to be voted on separated by comma (`,`)",
};

const vote: Command = {
  commandCallback: (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ): void => {
    if (!isPoll(votes)) {
      message.reply("Bitch you gotta start a poll first!");
    } else if (hasVoted(message.author, voted)) {
      message.reply("Bitch you already voted!");
    } else if (votes[query] === undefined) {
      message.reply(`You can't vote for ${query}, bitch!`);
    } else {
      votes[query] += 1;
      voted.push(message.author.username + message.author.discriminator);
      message.channel.send(`${message.author.username} voted for ${query}!`);
    }
  },
  commandDescription: "votes for a single candidate. only one vote per poll",
};

const tally: Command = {
  commandCallback: (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ): void => {
    if (isPoll(votes)) {
      // maps the votes object properties to objects
      const voteResult: VoteResult[] = _.sortBy(
        Object.keys(votes).map((key) => ({
          key,
          value: votes[key],
        })),
        (obj) => {
          return obj.value;
        },
      );
      const winner = voteResult.pop() as VoteResult; // sorted ascending, winner at end
      _.each(voteResult, (obj: any) => {
        message.channel.send(`${obj.key} had ${obj.value} votes.`);
      });
      message.channel.send(
        `The winner is ${winner.key} with ${winner.value} votes!`,
      );
      // clear the object while keeping its immutability
      for (const voteOption of Object.keys(votes)) {
        delete votes[voteOption];
      }
      voted.length = 0; // clear the array while keeping its immutability
    } else {
      message.reply("Bitch you gotta start a poll first!");
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
