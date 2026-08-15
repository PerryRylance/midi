import DeviceManufacturer from "../../DeviceManufacturer";
import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import Event, { EventType } from "../Event";
import { CallableAccessor, createCallableAccessor } from "../../CallableProperty";

export enum UniversalDevices {
	NON_REAL_TIME	= 0x7E,
	REAL_TIME		= 0x7F
};

type SysExManufacturer = DeviceManufacturer | UniversalDevices;

export default class SysExEvent extends Event
{
	private _manufacturer: SysExManufacturer = DeviceManufacturer.AKAI;
	private _manufacturerAccessor?: CallableAccessor<SysExManufacturer, this>;
	bytes: Uint8Array = new Uint8Array(); // NB: Payload not including 0xF7 terminator

	get manufacturer(): CallableAccessor<SysExManufacturer, this>
	{
		return this._manufacturerAccessor ??= createCallableAccessor(this, () => this._manufacturer, value => { this.manufacturer = value; });
	}

	set manufacturer(value: SysExManufacturer)
	{
		this._manufacturer = value;
	}

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