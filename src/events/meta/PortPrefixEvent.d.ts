import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import MetaEvent, { MetaEventType } from "./MetaEvent";
export default class PortPrefixEvent extends MetaEvent {
    private _port;
    readBytes(stream: ReadStream): void;
    get port(): number;
    set port(value: number);
    writeBytes(stream: WriteStream): void;
    protected getMetaType(): MetaEventType;
}
