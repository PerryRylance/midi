import ReadStream from "./streams/ReadStream";
import Track from "./Track";
import WriteStream from "./streams/WriteStream";
export default class File {
    tracks: Track[];
    private format;
    private timeDivision;
    private readHeader;
    readBytes(stream: ReadStream): void;
    writeBytes(stream: WriteStream): void;
}
