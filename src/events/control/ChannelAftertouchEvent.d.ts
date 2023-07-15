import ReadStream from "../../streams/ReadStream";
import { StatusBytes } from "../../streams/StatusBytes";
import WriteStream from "../../streams/WriteStream";
import ControlEvent from "./ControlEvent";
export default class ChannelAftertouchEvent extends ControlEvent {
    private _pressure;
    get pressure(): number;
    set pressure(value: number);
    readBytes(stream: ReadStream): void;
    writeBytes(stream: WriteStream, status?: StatusBytes): void;
    protected getTypeHibyte(): number;
}
