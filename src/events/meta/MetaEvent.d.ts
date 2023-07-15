import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import Event from "../Event";
export declare enum MetaEventType {
    SEQUENCE_NUMBER = 0,
    TEXT = 1,
    COPYRIGHT = 2,
    TRACK_NAME = 3,
    INSTRUMENT_NAME = 4,
    LYRIC = 5,
    MARKER = 6,
    CUE_POINT = 7,
    CHANNEL_PREFIX = 32,
    PORT_PREFIX = 33,
    END_OF_TRACK = 47,
    SET_TEMPO = 81,
    SMPTE_OFFSET = 84,
    TIME_SIGNATURE = 88,
    KEY_SIGNATURE = 89,
    SEQUENCER_SPECIFIC = 127
}
export default abstract class MetaEvent extends Event {
    protected assertByteLength(stream: ReadStream, actual: number, expected: number): void;
    protected writeType(stream: WriteStream): void;
    protected abstract getMetaType(): MetaEventType;
}
