import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";

import MetaEvent, { MetaEventType } from "./MetaEvent";
import { CallableAccessor, createCallableAccessor } from "../../CallableProperty";

export enum Quality
{
	MAJOR = 0,
	MINOR = 1
};

export default class KeySignatureEvent extends MetaEvent
{
	private _accidentals: number = 0;
	private _accidentalsAccessor?: CallableAccessor<number, this>;
	private _quality: Quality = Quality.MAJOR;
	private _qualityAccessor?: CallableAccessor<Quality, this>;

	get quality(): CallableAccessor<Quality, this>
	{
		return this._qualityAccessor ??= createCallableAccessor(this, () => this._quality, value => { this.quality = value; });
	}

	set quality(value: Quality)
	{
		this._quality = value;
	}

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

	get accidentals(): CallableAccessor<number, this>
	{
		return this._accidentalsAccessor ??= createCallableAccessor(this, () => this._accidentals, value => { this.accidentals = value; });
	}

	set accidentals(value: number)
	{
		if(value < -7 || value > 7)
			throw new RangeError("Key signature accidentals out of range");
		
		this._accidentals = value;
	}
}