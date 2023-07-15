import MetaEvent, { MetaEventType } from "./MetaEvent";
import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";


const MICROSECONDS_PER_MINUTE = 60000000.0;

export default class SetTempoEvent extends MetaEvent
{
	private mspqn: number = 120 * MICROSECONDS_PER_MINUTE;

	get bpm()
	{
		return MICROSECONDS_PER_MINUTE / this.mspqn;
	}

	set bpm(value: number)
	{
		const mspqn = Math.round(MICROSECONDS_PER_MINUTE / value);

		this.assertNonZero(mspqn);

		if(mspqn > 0xFFFFFF)
			throw new RangeError("Microseconds-per-quarter-note exceeds maximum");

		this.mspqn = mspqn;
	}

	readBytes(stream: ReadStream)
	{
		this.assertByteLength(stream, stream.readByte(), 3);

		// TODO: Don't think we need & 0xFF here
		const a = stream.readByte() & 0xFF;
		const b = stream.readByte() & 0xFF;
		const c = stream.readByte() & 0xFF;
		
		this.mspqn = (a << 16) | (b << 8) | c;
	}

	writeBytes(stream: WriteStream): void
	{
		super.writeBytes(stream);

		stream.writeByte(3);

		stream.writeByte((this.mspqn >> 16) & 0xFF);
		stream.writeByte((this.mspqn >> 8) & 0xFF);
		stream.writeByte(this.mspqn & 0xFF);
	}

	protected getMetaType(): MetaEventType
	{
		return MetaEventType.SET_TEMPO;
	}
}