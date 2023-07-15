import ReadStream from "../../streams/ReadStream";
import MetaEvent, { MetaEventType } from "./MetaEvent";
import DeviceManufacturer from "../../DeviceManufacturer";
import WriteStream from "../../streams/WriteStream";
export default class SequencerSpecificEvent extends MetaEvent {
    manufacturer: DeviceManufacturer;
    bytes: Uint8Array;
    readBytes(stream: ReadStream): void;
    writeBytes(stream: WriteStream): void;
    protected getMetaType(): MetaEventType;
}
