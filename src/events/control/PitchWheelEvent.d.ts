import ReadStream from "../../streams/ReadStream";
import ControlEvent from "./ControlEvent";
import { StatusBytes } from "../../streams/StatusBytes";
import WriteStream from "../../streams/WriteStream";
export default class PitchWheelEvent extends ControlEvent {
    value: number;
    readBytes(stream: ReadStream): void;
    writeBytes(stream: WriteStream, status?: StatusBytes): void;
    protected getTypeHibyte(): number;
    get amount(): number;
    set amount(floating: number);
}
