import { Client, Message, User } from "discord.js";
import _ from "lodash";
import { Command } from "../command.interface";
import { hasVoted, isPoll } from "./helper";
import {ReferendumCommandKeyList} from "./referendum.interface";
// only one poll at a time
var voted: string[] = [];
var votes: { [key: string]: number } = {};
const poll: Command = { // starts vote, must supply options
    commandDescription: "starts vote, must supply candidates to be voted on",
    commandCallback: (
        client: Client,
        db: firebase.database.Database,
        query: string,
        message: Message
    ): void => {
        if (!isPoll(votes)) { // vote already in progress
            message.author.send("You need to tally before you can start another poll");
        } else {
            let args = message.content.split(",");  // candidates should be separated by commas
            _.each(args, (candidate: string) => {
                votes[candidate] = 0;
            });
        }
    }
};

const vote: Command = {
    commandDescription: "votes for a single candidate.  only one vote per poll",
    commandCallback: (
        client: Client,
        db: firebase.database.Database,
        query: string,
        message: Message
    ): void => {
        if (!isPoll(votes)) {
            message.author.send("Bitch you gotta start a poll first!");
        } else if (hasVoted(message.author, voted)) {
            message.author.send("Bitch you already voted!");
        } else if (!votes[query]) {
            message.author.send(`You can't vote for ${query}, bitch!`);
        } else {
            votes[query] += 1;
        }
    }
};

const tally: Command = {
    commandDescription: "tallies votes and resets everything",
    commandCallback: (
        client: Client,
        db: firebase.database.Database,
        query: string,
        message: Message
    ): void => {
        if (isPoll(votes)) {
            let votes_array: any[] = Object.keys(votes).map(key => ({ key, value: votes[key] })); // maps the votes object properties to objects
            _.sortBy(votes_array, (obj) => { return obj.value });
            let winner = votes_array.pop(); // sorted ascending, pop winner from end
            _.each(votes_array, (obj: any) => {
                message.channel.send(`${obj.key} had ${obj.value} votes.`)
            });
            message.channel.send(`The winner is ${winner.key} with ${winner.value} votes!`);
        } else {
            message.author.send("Bitch you gotta start a poll first!");
        }
    }
};

export const referendumCommandKeyList: ReferendumCommandKeyList = {
    REFERENDUM_POLL: "~poll",
    REFERENDUM_VOTE: "~vote",
    REFERENDUM_TALLY: "~tally"
};

export default {
    [referendumCommandKeyList.REFERENDUM_POLL]: poll,
    [referendumCommandKeyList.REFERENDUM_VOTE]: vote,
    [referendumCommandKeyList.REFERENDUM_TALLY]: tally
};
