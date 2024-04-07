import ReadStream from "../streams/ReadStream";
import { StatusBytes } from "../streams/StatusBytes";
import WriteStream from "../streams/WriteStream";

export enum EventType {
	CONTROL = 0,
	SYSEX = 0xF0,
	META = 0xFF
};

export default abstract class Event
{
	private _delta: number = 0;

	constructor(delta: number = 0)
	{
		this.delta = delta;
	}

	abstract readBytes(stream: ReadStream): void;
	protected abstract writeType(stream: WriteStream, status?: StatusBytes): void;

	get delta(): number
	{
		return this._delta;
	}

	set delta(value: number)
	{
		this.assertValidDelta(value);

		this._delta = value;
	}
	
	writeBytes(stream: WriteStream, status?: StatusBytes): void
	{
		// NB: Delta is stored on events but written by tracks. This allows events to be sent in real time (real time devices do not support delta)

		this.writeType(stream, status);
	}

	// abstract toString(): string;

	protected assertPositiveInteger(value: number): void
	{
		if(value < 0)
			throw new RangeError("Value cannot be negative");
		
		if(!Number.isInteger(value))
			throw new TypeError("Value must be an integer");
	}

	protected assertValidDelta(value: number): void
	{
		this.assertValidVlv(value);
	}

	protected assertValidChannel(channel: number): void
	{
		this.assertUnsignedAndBelow(channel, 0xF);
	}

	protected assertUnsignedAndBelow(value: number, max: number)
	{
		this.assertPositiveInteger(value);

		if(value > max)
			throw new RangeError("Value too large");
	}

	protected assertNonZero(value: number)
	{
		if(value === 0)
			throw new RangeError("Value must be non-zero");
	}

	protected assertValidByte(value: number)
	{
		this.assertUnsignedAndBelow(value, 0xFF);
	}

	protected assertValidShort(value: number)
	{
		this.assertUnsignedAndBelow(value, 0xFFFF);
	}

	protected assertValidUint(value: number)
	{
		this.assertUnsignedAndBelow(value, 0xFFFFFFFF);
	}

	protected assertValidVlv(value: number)
	{
		this.assertUnsignedAndBelow(value, 0x0FFFFFFF);
	}
}