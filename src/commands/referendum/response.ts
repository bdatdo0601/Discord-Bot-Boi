import { CommandResponse } from "@commands/command.interface";

export default {
  ALREADY_VOTED: () => "Bitch you already voted!",
  INVALID_QUERY: (query) => `You can't vote for ${query}, bitch!`,
  POLL_ALREADY_EXIST: () =>
    "You need to tally before you can start another poll",
  POLL_NOT_CREATED: () => "Bitch you gotta start a poll first!",
} as CommandResponse;
