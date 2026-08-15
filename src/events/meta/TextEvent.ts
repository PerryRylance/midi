import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";

import MetaEvent, { MetaEventType } from "./MetaEvent";
import { CallableAccessor, createCallableStringAccessor } from "../../CallableProperty";

export default class TextEvent extends MetaEvent
{
	private _text: string = "";
	private _textAccessor?: CallableAccessor<string, this>;

	get text(): CallableAccessor<string, this>
	{
		return this._textAccessor ??= createCallableStringAccessor(this, () => this._text, value => { this.text = value; });
	}

	set text(value: string)
	{
		this.assertValidText(value);

		this._text = value;
	}

	readBytes(stream: ReadStream): void
	{
		const length = stream.readVLV();

		for(let i = 0; i < length; i++)
			this.text += String.fromCharCode(stream.readByte());
	}

	writeBytes(stream: WriteStream): void
	{
		super.writeBytes(stream);

		stream.writeVLV(this.text.length);

		for(let i = 0; i < this.text.length; i++)
			stream.writeByte(this.text.charCodeAt(i));
	}

	protected getMetaType(): MetaEventType
	{
		return MetaEventType.TEXT;
	}

	private assertValidText(value: string): void
	{
		if(value.length > 0x0FFFFFFF)
			throw new RangeError("Text too long"); // NB: I'd really hope not but this is the maximum a VLV can represent

		if(!/^[\x00-\xFF]*$/.test(value))
			throw new RangeError("One or more characters are not valid ASCII");
	}
}
