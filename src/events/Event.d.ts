import ReadStream from "../streams/ReadStream";
import { StatusBytes } from "../streams/StatusBytes";
import WriteStream from "../streams/WriteStream";
export declare enum EventType {
    CONTROL = 0,
    SYSEX = 240,
    META = 255
}
export default abstract class Event {
    private _delta;
    constructor(delta?: number);
    abstract readBytes(stream: ReadStream): void;
    protected abstract writeType(stream: WriteStream, status?: StatusBytes): void;
    get delta(): number;
    set delta(value: number);
    writeBytes(stream: WriteStream, status?: StatusBytes): void;
    protected assertPositiveInteger(value: number): void;
    protected assertValidDelta(value: number): void;
    protected assertValidChannel(channel: number): void;
    protected assertUnsignedAndBelow(value: number, max: number): void;
    protected assertNonZero(value: number): void;
    protected assertValidByte(value: number): void;
    protected assertValidShort(value: number): void;
    protected assertValidUint(value: number): void;
    protected assertValidVlv(value: number): void;
}
