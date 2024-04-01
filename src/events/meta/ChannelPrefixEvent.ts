import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import { EventWriteOptions } from "../Event";

import MetaEvent, { MetaEventType } from "./MetaEvent";

export default class ChannelPrefixEvent extends MetaEvent
{
	private _channel: number = 0;

	get channel(): number
	{
		return this._channel;
	}

	set channel(value: number)
	{
		this.assertValidChannel(value);

		this._channel = value;
	}

	readBytes(stream: ReadStream): void
	{
		this.assertByteLength(stream, stream.readByte(), 1);

		this.channel = stream.readByte();
	}

	writeBytes(stream: WriteStream, status?: undefined, options?: EventWriteOptions): void
	{
		super.writeBytes(stream, status, options);

		stream.writeByte(1);

		stream.writeByte(this.channel);
	}

	protected getMetaType(): MetaEventType
	{
		return MetaEventType.CHANNEL_PREFIX;
	}
}