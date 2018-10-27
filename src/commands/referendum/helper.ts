import { User } from "discord.js";
import _ from "lodash";

export function hasVoted(user: User, voted: string[]): boolean { // has user voted?
    return (_.includes(voted, user.username + user.discriminator));
}
export function isPoll(votes: { [key: string]: number }): boolean { // is there a poll going on?
    return (Object.keys(votes).length > 0);
}
