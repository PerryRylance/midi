import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import MetaEvent, { MetaEventType } from "./MetaEvent";
export declare enum Rate {
    FPS_24 = 0,
    FPS_25 = 1,
    FPS_DROP_30 = 2,
    FPS_30 = 3
}
export default class SmtpeOffsetEvent extends MetaEvent {
    rate: Rate;
    hours: number;
    minutes: number;
    seconds: number;
    frames: number;
    subframes: number;
    readBytes(stream: ReadStream): void;
    writeBytes(stream: WriteStream): void;
    protected getMetaType(): MetaEventType;
}
