import DeviceManufacturer from "../../DeviceManufacturer";
import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import Event, { EventType } from "../Event";

export enum UniversalDevices {
	NON_REAL_TIME	= 0x7E,
	REAL_TIME		= 0x7F
};

type SysExManufacturer = DeviceManufacturer | UniversalDevices;

export default class SysExEvent extends Event
{
	manufacturer: SysExManufacturer = DeviceManufacturer.AKAI;
	bytes: Uint8Array = new Uint8Array(); // NB: Payload not including 0xF7 terminator

	readBytes(stream: ReadStream): void
	{
		const buffer: number[] = [];
		let byte;

		this.manufacturer = stream.readByte();

		while((byte = stream.readByte()) !== 0xF7)
			buffer.push(byte);
		
		this.bytes = new Uint8Array(buffer);
	}

	writeBytes(stream: WriteStream): void
	{
		super.writeBytes(stream);

		stream.writeByte(this.manufacturer);

		for(let i = 0; i < this.bytes.length; i++)
			stream.writeByte(this.bytes[i]);

		stream.writeByte(0xF7);
	}

	protected writeType(stream: WriteStream): void
	{
		stream.writeByte(EventType.SYSEX);
	}
}