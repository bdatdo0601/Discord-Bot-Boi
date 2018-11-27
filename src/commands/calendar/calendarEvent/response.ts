import { CommandResponse } from "@commands/command.interface";

export default {
  LIST_CALENDAR_EVENT: (response) =>
    `Here are our events for the next week (you can subscribe to our calendar with \`~getCalendar\`): \n ${response}`,
};
