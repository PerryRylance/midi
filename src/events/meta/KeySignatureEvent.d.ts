import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import MetaEvent, { MetaEventType } from "./MetaEvent";
export declare enum Quality {
    MAJOR = 0,
    MINOR = 1
}
export default class KeySignatureEvent extends MetaEvent {
    private _accidentals;
    quality: Quality;
    readBytes(stream: ReadStream): void;
    writeBytes(stream: WriteStream): void;
    protected getMetaType(): MetaEventType;
    get accidentals(): number;
    set accidentals(value: number);
}
