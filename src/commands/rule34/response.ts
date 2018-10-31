import { CommandResponse } from "@commands/command.interface";

export default {
  GET_RECURRING_CHANNEL: (channelID) =>
    `The current Rule 34 recurring channel is <#${channelID}>`,
  INVALID_CHANNEL: () => "Lewd stuff don't belong here",
  NO_KEYWORD_FOUND: () => "There are no keyword found",
  RECURRING_CHANNEL_DELETED: () => "Recurring Channel is now deleted",
  RECURRING_CHANNEL_SET: () =>
    "Rule34 Recurring Images will now be posted here",
  RECURRING_NOT_FOUND: () => "I can't find any recurring channel for rule 34",
  TOPIC_NOT_FOUND: (topic) => `I could not find ${topic} in my db`,
  WORDS_NOT_FOUND: () => "You didn't give any word :[",
} as CommandResponse;
