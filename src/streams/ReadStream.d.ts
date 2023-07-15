import Stream from "./Stream";
export default class ReadStream extends Stream {
    private dataView;
    constructor(buffer: ArrayBuffer);
    getLength(): number;
    readByte(): number;
    readShort(): number;
    readUint(): number;
    readVLV(): number;
    assertPositionValid(): void;
    seekRelative(relative: number): void;
}
