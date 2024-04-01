import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import { EventWriteOptions } from "../Event";

import MetaEvent, { MetaEventType } from "./MetaEvent";

export default class TextEvent extends MetaEvent
{
	private _text: string = "";

	get text(): string
	{
		return this._text;
	}

	set text(value: string)
	{
		this.assertValidText(value);

		this._text = value;
	}

	readBytes(stream: ReadStream): void
	{
		const length = stream.readByte();

		for(let i = 0; i < length; i++)
			this.text += String.fromCharCode(stream.readByte());
	}

	writeBytes(stream: WriteStream, status?: undefined, options?: EventWriteOptions): void
	{
		super.writeBytes(stream, status, options);

		stream.writeByte(this.text.length);

		for(let i = 0; i < this.text.length; i++)
			stream.writeByte(this.text.charCodeAt(i));
	}

	protected getMetaType(): MetaEventType
	{
		return MetaEventType.TEXT;
	}

	private assertValidText(value: string): void
	{
		if(value.length > 255)
			throw new RangeError("Text too long");
		
		if(!/^[\x00-\xFF]*$/.test(value))
			throw new RangeError("One or more characters are not valid ASCII");
	}
}