import Event from "../Event";
import ReadStream from "../../streams/ReadStream";
import { StatusBytes } from "../../streams/StatusBytes";
export default class EventFactory {
    static fromStream(stream: ReadStream, status: StatusBytes): Event;
}
