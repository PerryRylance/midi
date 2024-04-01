import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import { EventWriteOptions } from "../Event";

import MetaEvent, { MetaEventType } from "./MetaEvent";

export default class SequenceNumberEvent extends MetaEvent
{
	private _number: number = 0;

	get number(): number
	{
		return this._number;
	}

	set number(value: number)
	{
		this.assertValidShort(value);

		this._number = value;
	}

	readBytes(stream: ReadStream): void
	{
		this.assertByteLength(stream, stream.readByte(), 2);

		this.number = stream.readShort();
	}

	writeBytes(stream: WriteStream, status?: undefined, options?: EventWriteOptions): void
	{
		super.writeBytes(stream, status, options);

		stream.writeByte(2);

		stream.writeShort(this.number);
	}

	protected getMetaType(): MetaEventType
	{
		return MetaEventType.SEQUENCE_NUMBER;
	}
}