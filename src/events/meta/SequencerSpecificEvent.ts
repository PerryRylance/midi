import ReadStream from "../../streams/ReadStream";
import MetaEvent, { MetaEventType } from "./MetaEvent";
import DeviceManufacturer from "../../DeviceManufacturer";
import WriteStream from "../../streams/WriteStream";

export default class SequencerSpecificEvent extends MetaEvent
{
	manufacturer: DeviceManufacturer = DeviceManufacturer.AKAI;
	bytes: Uint8Array = new Uint8Array();

	readBytes(stream: ReadStream): void
	{
		const length = stream.readByte();

		this.manufacturer = stream.readByte();
		this.bytes = new Uint8Array(length - 1);

		for(let i = 1; i < length; i++)
			this.bytes[i] = stream.readByte();
	}

	writeBytes(stream: WriteStream): void
	{
		super.writeBytes(stream);

		stream.writeByte(this.bytes.length + 1); // NB: Add 1 for manufacturer

		stream.writeByte(this.manufacturer);

		for(let i = 0; i < this.bytes.length; i++)
			stream.writeByte(this.bytes[i]);
	}

	protected getMetaType(): MetaEventType
	{
		return MetaEventType.SEQUENCER_SPECIFIC;
	}
}