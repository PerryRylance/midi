import MetaEvent, { MetaEventType } from "./MetaEvent";
import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
export default class SetTempoEvent extends MetaEvent {
    private mspqn;
    get bpm(): number;
    set bpm(value: number);
    readBytes(stream: ReadStream): void;
    writeBytes(stream: WriteStream): void;
    protected getMetaType(): MetaEventType;
}
