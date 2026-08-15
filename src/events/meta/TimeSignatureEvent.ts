import MetaEvent, { MetaEventType } from "./MetaEvent";
import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import { CallableAccessor, createCallableAccessor } from "../../CallableProperty";

export default class TimeSignatureEvent extends MetaEvent
{
	private _numerator: number = 4;
	private _denominator: number = 4;
	private _ticksPerMetronomeClick = 24;
	private _num32ndNotesPerBeat = 8;

	private _numeratorAccessor?: CallableAccessor<number, this>;
	private _denominatorAccessor?: CallableAccessor<number, this>;
	private _ticksPerMetronomeClickAccessor?: CallableAccessor<number, this>;
	private _num32ndNotesPerBeatAccessor?: CallableAccessor<number, this>;

	get numerator(): CallableAccessor<number, this>
	{
		return this._numeratorAccessor ??= createCallableAccessor(this, () => this._numerator, value => { this.numerator = value; });
	}

	set numerator(value: number)
	{
		this.assertUnsignedAndBelow(value, 0xFF);
		this.assertNonZero(value);

		this._numerator = value;
	}

	get denominator(): CallableAccessor<number, this>
	{
		return this._denominatorAccessor ??= createCallableAccessor(this, () => this._denominator, value => { this.denominator = value; });
	}

	set denominator(value: number)
	{
		this.assertPositiveInteger(value);

		if(Math.log2(value) % 1 !== 0)
			throw new Error("Denominator must be a power of two");
		
		this._denominator = value;
	}

	get ticksPerMetronomeClick(): CallableAccessor<number, this>
	{
		return this._ticksPerMetronomeClickAccessor ??= createCallableAccessor(this, () => this._ticksPerMetronomeClick, value => { this.ticksPerMetronomeClick = value; });
	}

	// TODO: Not too sure about this. Check spec for valid values
	set ticksPerMetronomeClick(value: number)
	{
		this.assertUnsignedAndBelow(value, 0xFF);
		this.assertNonZero(value);

		this._ticksPerMetronomeClick = value;
	}

	get num32ndNotesPerBeat(): CallableAccessor<number, this>
	{
		return this._num32ndNotesPerBeatAccessor ??= createCallableAccessor(this, () => this._num32ndNotesPerBeat, value => { this.num32ndNotesPerBeat = value; });
	}
	
	// TODO: Not too sure about this. Check spec for valid values
	set num32ndNotesPerBeat(value: number)
	{
		this.assertUnsignedAndBelow(value, 0xFF);
		this.assertNonZero(value);

		this._num32ndNotesPerBeat = value;
	}

	readBytes(stream: ReadStream)
	{
		this.assertByteLength(stream, stream.readByte(), 4);
		
		this.numerator = stream.readByte();
		this.denominator = Math.pow(2, stream.readByte());
		this.ticksPerMetronomeClick = stream.readByte();
		this.num32ndNotesPerBeat = stream.readByte();
	}

	writeBytes(stream: WriteStream): void
	{
		super.writeBytes(stream);

		stream.writeByte(4);

		stream.writeByte(this.numerator);
		stream.writeByte(Math.log2(this.denominator));
		stream.writeByte(this.ticksPerMetronomeClick);
		stream.writeByte(this.num32ndNotesPerBeat);
	}

	protected getMetaType(): MetaEventType
	{
		return MetaEventType.TIME_SIGNATURE;
	}
}