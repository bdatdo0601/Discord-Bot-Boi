import { Event } from "./event.interface";
import errorEvent from "./error";
import messageEvent from "./message";
import readyEvent from "./ready";

const eventList: Event[] = [readyEvent, errorEvent, messageEvent];

export const placeHolder = () => {
    return "";
};

export default eventList;
