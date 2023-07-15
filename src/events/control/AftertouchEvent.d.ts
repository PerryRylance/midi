import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import { StatusBytes } from "../../streams/StatusBytes";
import ControlEvent from "./ControlEvent";
export default class AftertouchEvent extends ControlEvent {
    private _key;
    private _pressure;
    get key(): number;
    set key(value: number);
    get pressure(): number;
    set pressure(value: number);
    readBytes(stream: ReadStream): void;
    writeBytes(stream: WriteStream, status?: StatusBytes): void;
    protected getTypeHibyte(): number;
}
