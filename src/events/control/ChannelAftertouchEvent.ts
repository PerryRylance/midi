import ReadStream from "../../streams/ReadStream";
import { StatusBytes } from "../../streams/StatusBytes";
import WriteStream from "../../streams/WriteStream";
import ControlEvent, { ControlEventType } from "./ControlEvent";

export default class ChannelAftertouchEvent extends ControlEvent
{
	private _pressure: number = 127;

	get pressure(): number
	{
		return this._pressure;
	}

	set pressure(value: number)
	{
		this.assertValidVelocityLike(value);

		this._pressure = value;
	}

	readBytes(stream: ReadStream): void
	{
		this.pressure = stream.readByte();
	}

	writeBytes(stream: WriteStream, status?: StatusBytes): void
	{
		super.writeBytes(stream, status);

		stream.writeByte(this.pressure);
	}

	protected getTypeHibyte(): number
	{
		return ControlEventType.CHANNEL_AFTERTOUCH;
	}
}