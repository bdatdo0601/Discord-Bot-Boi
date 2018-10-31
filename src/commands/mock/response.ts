import { CommandResponse } from "@commands/command.interface";

export default {
  ATTACK_AUTHOR: (authorID) => `<@${authorID}> Cuck yourself first <3`,
  MOCKING: (userID, message) => `<@${userID}>: ${message}`,
  PREV_MESSAGE_NOT_FOUND: (userID) =>
    `I don't see any previous message of <@${userID}>`,
} as CommandResponse;
