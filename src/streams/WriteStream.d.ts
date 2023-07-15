import Stream from "./Stream";
export default class WriteStream extends Stream {
    private buffer;
    constructor();
    writeByte(value: number): void;
    writeShort(value: number): void;
    writeUint(value: number): void;
    writeVLV(value: number): void;
    seekTo(position: number): void;
    toArrayBuffer(): ArrayBuffer;
    toDataURL(): string;
}
