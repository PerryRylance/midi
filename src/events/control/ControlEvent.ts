import { StatusBytes } from "../../streams/StatusBytes";
import WriteStream from "../../streams/WriteStream";
import Event, { EventType } from "../Event";

export enum ControlEventType {
	NOTE_OFF			= 0x80,
	NOTE_ON				= 0x90,

	AFTERTOUCH			= 0xA0,
	KEY_PRESSURE		= 0xA0,

	CONTROLLER			= 0xB0,
	PROGRAM_CHANGE		= 0xC0,

	CHANNEL_AFTERTOUCH	= 0xD0,
	CHANNEL_PRESSURE	= 0xD0,

	PITCH_WHEEL			= 0xE0
};

export default abstract class ControlEvent extends Event
{
	private _channel: number = 0;

	constructor(delta: number = 0, channel: number = 0)
	{
		super(delta);

		this.channel = channel;
	}

	protected abstract getTypeHibyte(): number;

	get channel(): number
	{
		return this._channel;
	}

	set channel(value: number)
	{
		this.assertValidChannel(value);

		this._channel = value;
	}

	protected writeType(stream: WriteStream, status?: StatusBytes): void
	{
		const hibyte = this.getTypeHibyte();

		if(status && (status[0] === hibyte && status[1] === this.channel))
			return; // NB: Skip, status is the same

		stream.writeByte( hibyte | this.channel );

		if(status)
		{
			status[0] = hibyte;
			status[1] = this.channel;
		}
	}

	protected assertValidKey(value: number)
	{
		this.assertPositiveInteger(value);
		this.assertUnsignedAndBelow(value, 0x7F);
	}

	protected assertValidVelocityLike(value: number)
	{
		this.assertPositiveInteger(value);
		this.assertUnsignedAndBelow(value, 0x7F);
	}
}