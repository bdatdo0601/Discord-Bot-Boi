import { CommandResponse } from "@commands/command.interface";

export default {
  INIT_CALENDAR_FAILED: () => "Oops, can't initialized",
  INIT_CALENDAR_PENDING: () => "Please wait...",
  INIT_CALENDAR_SUCCESS: () => "Calendar has been initialized",
} as CommandResponse;
