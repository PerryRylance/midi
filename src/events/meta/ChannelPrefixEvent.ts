import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";

import MetaEvent, { MetaEventType } from "./MetaEvent";
import { CallableAccessor, createCallableAccessor } from "../../CallableProperty";

export default class ChannelPrefixEvent extends MetaEvent
{
	private _channel: number = 0;
	private _channelAccessor?: CallableAccessor<number, this>;

	get channel(): CallableAccessor<number, this>
	{
		return this._channelAccessor ??= createCallableAccessor(this, () => this._channel, value => { this.channel = value; });
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

	writeBytes(stream: WriteStream): void
	{
		super.writeBytes(stream);

		stream.writeByte(1);

		stream.writeByte(this.channel);
	}

	protected getMetaType(): MetaEventType
	{
		return MetaEventType.CHANNEL_PREFIX;
	}
}