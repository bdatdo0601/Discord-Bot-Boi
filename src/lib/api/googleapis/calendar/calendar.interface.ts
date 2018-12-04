import { Moment } from "moment";

export enum AccessControlRole {
  NONE = "none",
  FREE_BUSY_ONLY = "freeBusyReader",
  READER = "reader",
  WRITER = "writer",
  OWNER = "owner",
}

export enum EventStatus {
  CONFIRMED = "confirmed",
  TENTATIVE = "tentative",
  CANCELLED = "cancelled",
}

export interface EventSearchQuery {
  stringQuery?: string;
  timeMin?: Moment;
  timeMax?: Moment;
}

export interface EventAttendeeInput {
  displayName: string;
  additionalGuests?: number;
  comment: string;
  email: string;
  optional?: boolean;
  responseStatus?: string;
}

export interface CalendarTimeFormat {
  dateTime: string;
}

export interface EventInsertQuery {
  startTime: CalendarTimeFormat;
  endTime: CalendarTimeFormat;
  summary: string;
  attendees?: EventAttendeeInput[];
  description?: string;
  location?: string;
  recurrence: string[]; // https://developers.google.com/calendar/concepts/events-calendars#recurring_events
  status?: EventStatus;
}
