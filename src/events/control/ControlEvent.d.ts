import { StatusBytes } from "../../streams/StatusBytes";
import WriteStream from "../../streams/WriteStream";
import Event from "../Event";
export declare enum ControlEventType {
    NOTE_OFF = 128,
    NOTE_ON = 144,
    AFTERTOUCH = 160,
    KEY_PRESSURE = 160,
    CONTROLLER = 176,
    PROGRAM_CHANGE = 192,
    CHANNEL_AFTERTOUCH = 208,
    CHANNEL_PRESSURE = 208,
    PITCH_WHEEL = 224
}
export default abstract class ControlEvent extends Event {
    private _channel;
    constructor(delta?: number, channel?: number);
    protected abstract getTypeHibyte(): number;
    get channel(): number;
    set channel(value: number);
    protected writeType(stream: WriteStream, status?: StatusBytes): void;
    protected assertValidKey(value: number): void;
    protected assertValidVelocityLike(value: number): void;
}
