import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import MetaEvent, { MetaEventType } from "./MetaEvent";
export default class SequenceNumberEvent extends MetaEvent {
    private _number;
    get number(): number;
    set number(value: number);
    readBytes(stream: ReadStream): void;
    writeBytes(stream: WriteStream): void;
    protected getMetaType(): MetaEventType;
}
