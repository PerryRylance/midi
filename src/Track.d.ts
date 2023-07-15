import ReadStream from "./streams/ReadStream";
import WriteStream from "./streams/WriteStream";
import Event from "./events/Event";
export default class Track {
    events: Event[];
    readBytes(stream: ReadStream): void;
    writeBytes(stream: WriteStream): void;
}
