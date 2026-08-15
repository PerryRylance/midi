import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import { StatusBytes } from "../../streams/StatusBytes";
import ControlEvent, { ControlEventType } from "./ControlEvent";
import { CallableAccessor, createCallableAccessor } from "../../CallableProperty";

export default class AftertouchEvent extends ControlEvent
{
	private _key: number = 60;
	private _pressure: number = 127;
	private _keyAccessor?: CallableAccessor<number, this>;
	private _pressureAccessor?: CallableAccessor<number, this>;

	get key(): CallableAccessor<number, this>
	{
		return this._keyAccessor ??= createCallableAccessor(this, () => this._key, value => { this.key = value; });
	}

	set key(value: number)
	{
		this.assertValidKey(value);

		this._key = value;
	}

	get pressure(): CallableAccessor<number, this>
	{
		return this._pressureAccessor ??= createCallableAccessor(this, () => this._pressure, value => { this.pressure = value; });
	}

	set pressure(value: number)
	{
		this.assertValidVelocityLike(value);

		this._pressure = value;
	}

	readBytes(stream: ReadStream): void
	{
		this.key = stream.readByte();
		this.pressure = stream.readByte();
	}

	writeBytes(stream: WriteStream, status?: StatusBytes): void
	{
		super.writeBytes(stream, status);

		stream.writeByte(this.key);
		stream.writeByte(this.pressure);
	}

	protected getTypeHibyte(): number
	{
		return ControlEventType.AFTERTOUCH;
	}
}