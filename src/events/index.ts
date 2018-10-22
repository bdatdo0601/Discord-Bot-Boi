import errorEvent from "./error";
import { Event } from "./event.interface";
import messageEvent from "./message";
import readyEvent from "./ready";

const eventList: Event[] = [readyEvent, errorEvent, messageEvent];

export default eventList;
