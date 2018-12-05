export interface CalendarEventCommandKeyList {
  LIST_EVENT: "~listEvent";
  CREATE_NEW_EVENT: "~createEvent";
  DELETE_EVENT: "~deleteEvent";
  ADD_ATTENDEE_TO_EVENT: "~goingTo";
  REMOVE_ATTENDEE_FROM_EVENT: "~notGoingTo";
  EVENT_INFO: "~event";
  EVENT_UPDATE_LOCATION: "~updateEventLocation";
  // CREATE_NEW_RECURRING_EVENT: "~createRecurringEvent";
  // DELETE_RECURRING_EVENT: "~deleteRecurringEvent";
  // UPDATE_EVENT: "~updateEvent";
}
