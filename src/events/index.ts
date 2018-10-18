import { Event } from "../typings/interfaces/event";
import errorEvent from "./error";
import messageEvent from "./message";
import readyEvent from "./ready";

const eventList: Event[] = [readyEvent, errorEvent, messageEvent];

export default eventList;
