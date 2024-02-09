import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";

import MetaEvent, { MetaEventType } from "./MetaEvent";

export enum Quality
{
	MAJOR = 0,
	MINOR = 1
};

export default class KeySignatureEvent extends MetaEvent
{
	// TODO: Getters and setters for all these
	private _accidentals: number = 0;
	quality: Quality = Quality.MAJOR;

	readBytes(stream: ReadStream): void
	{
		this.assertByteLength(stream, stream.readByte(), 2);

		this.accidentals = stream.readSignedByte();
		this.quality = stream.readByte();
	}

	writeBytes(stream: WriteStream): void
	{
		super.writeBytes(stream);

		stream.writeByte(2);

		stream.writeSignedByte(this.accidentals);
		stream.writeByte(this.quality);
	}

	protected getMetaType(): MetaEventType
	{
		return MetaEventType.KEY_SIGNATURE;
	}

	get accidentals(): number
	{
		return this._accidentals;
	}

	set accidentals(value: number)
	{
		if(value < -7 || value > 7)
			throw new RangeError("Key signature accidentals out of range");
		
		this._accidentals = value;
	}
}