import ParseError from "../../exceptions/ParseError";
import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";

import MetaEvent, { MetaEventType } from "./MetaEvent";
import { FrameRate } from "../../FrameRate";
import { CallableAccessor, createCallableAccessor } from "../../CallableProperty";

export default class SmtpeOffsetEvent extends MetaEvent
{
	private _rate: number = FrameRate.FPS_24;
	private _hours: number = 1;
	private _minutes: number = 0;
	private _seconds: number = 0;
	private _frames: number = 0;
	private _subframes: number = 0;

	private _rateAccessor?: CallableAccessor<number, this>;
	private _hoursAccessor?: CallableAccessor<number, this>;
	private _minutesAccessor?: CallableAccessor<number, this>;
	private _secondsAccessor?: CallableAccessor<number, this>;
	private _framesAccessor?: CallableAccessor<number, this>;
	private _subframesAccessor?: CallableAccessor<number, this>;

	// TODO: Private and test parameters please
	// TODO: See spec http://www.somascape.org/midi/tech/mfile.html#:~:text=SMPTE%20Offset,-FF%2054%2005&text=ff%20is%20a%20byte%20specifying,prior%20to%20any%20MIDI%20events.

	get rate(): CallableAccessor<number, this>
	{
		return this._rateAccessor ??= createCallableAccessor(this, () => this._rate, value => { this.rate = value; });
	}

	set rate(value: number)
	{
		this._rate = value;
	}

	get hours(): CallableAccessor<number, this>
	{
		return this._hoursAccessor ??= createCallableAccessor(this, () => this._hours, value => { this.hours = value; });
	}

	set hours(value: number)
	{
		this._hours = value;
	}

	get minutes(): CallableAccessor<number, this>
	{
		return this._minutesAccessor ??= createCallableAccessor(this, () => this._minutes, value => { this.minutes = value; });
	}

	set minutes(value: number)
	{
		this._minutes = value;
	}

	get seconds(): CallableAccessor<number, this>
	{
		return this._secondsAccessor ??= createCallableAccessor(this, () => this._seconds, value => { this.seconds = value; });
	}

	set seconds(value: number)
	{
		this._seconds = value;
	}

	get frames(): CallableAccessor<number, this>
	{
		return this._framesAccessor ??= createCallableAccessor(this, () => this._frames, value => { this.frames = value; });
	}

	set frames(value: number)
	{
		this._frames = value;
	}

	get subframes(): CallableAccessor<number, this>
	{
		return this._subframesAccessor ??= createCallableAccessor(this, () => this._subframes, value => { this.subframes = value; });
	}

	set subframes(value: number)
	{
		this._subframes = value;
	}

	readBytes(stream: ReadStream)
	{
		this.assertByteLength(stream, stream.readByte(), 5);
		
		// NB: The fourth byte specifies the hours of the SMPTE time and the frame rate
		// NB: This byte has the binary format "0sshhhhh". The top bit is zero as it is reserved according to the MIDI time code specifications.
		const byte = stream.readByte();

		// NB: The two bits ss define the frame rate in frames per second.
		this.rate = (byte & 0x60) >> 5;

		// NB: The five hhhhh bits define the hours of the SMPTE time.
		this.hours = byte & 0x1F;

		// TOOD: Remove this once we have parameter handling..
		if(!(this.rate in FrameRate))
			throw new ParseError(stream, "Invalid SMTPE rate");

		this.minutes	= stream.readByte();
		this.seconds	= stream.readByte();
		this.frames		= stream.readByte();
		this.subframes	= stream.readByte();
	}

	writeBytes(stream: WriteStream): void
	{
		super.writeBytes(stream);

		stream.writeByte(5);

		stream.writeByte(((this.rate << 5) & 0x60) | (this.hours & 0x1F));

		stream.writeByte(this.minutes);
		stream.writeByte(this.seconds);
		stream.writeByte(this.frames);
		stream.writeByte(this.subframes);
	}

	protected getMetaType(): MetaEventType
	{
		return MetaEventType.SMPTE_OFFSET;
	}
}