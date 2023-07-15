import DeviceManufacturer from "../../DeviceManufacturer";
import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import Event from "../Event";
declare enum UniversalDevices {
    NON_REAL_TIME = 126,
    REAL_TIME = 127
}
type SysExManufacturer = DeviceManufacturer | UniversalDevices;
export default class SysExEvent extends Event {
    manufacturer: SysExManufacturer;
    bytes: Uint8Array;
    readBytes(stream: ReadStream): void;
    writeBytes(stream: WriteStream): void;
    protected writeType(stream: WriteStream): void;
}
export {};
