import errorEvent from "./error";
import { Event } from "./event.interface";
import messageEvent from "./message";
import presenceUpdateEvent from "./presenceUpdate";
import readyEvent from "./ready";

const eventList: Event[] = [
  readyEvent,
  errorEvent,
  messageEvent,
  presenceUpdateEvent,
];

export default eventList;
