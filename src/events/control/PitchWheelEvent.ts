import ReadStream from "../../streams/ReadStream";
import ControlEvent, { ControlEventType } from "./ControlEvent";
import ParseError from "../../exceptions/ParseError";
import { StatusBytes } from "../../streams/StatusBytes";
import WriteStream from "../../streams/WriteStream";
import { EventWriteOptions } from "../Event";

export default class PitchWheelEvent extends ControlEvent
{
	value: number = 0x2000; // NB: Value as a 14-bit number. Signed, but without any sign bit. This value is zero.

	readBytes(stream: ReadStream): void
	{
		const first		= stream.readByte();
		const second	= stream.readByte();

		if(first & 0x80)
			throw new ParseError(stream, "Expected first bit of first byte to be zero");

		this.value = ((second & 0x7F) << 7) | (first & 0x7F);
	}

	writeBytes(stream: WriteStream, status?: StatusBytes, options?: EventWriteOptions): void
	{
		super.writeBytes(stream, status, options);

		// NB: Internal		..012345 6789ABCD
		// NB: Serialized	.789ABCD .0123456

		const left	= (this.value & 0x7F);
		const right	= (this.value & 0x3F80) >> 7;

		stream.writeByte(left);
		stream.writeByte(right);
	}

	protected getTypeHibyte(): number
	{
		return ControlEventType.PITCH_WHEEL;
	}

	// TODO: Test this out please, do we need remapping eg for exponent
	get amount(): number
	{
		if(this.value <= 0x2000)
			return -1 + 2 * ((1 + this.value) / 0x3FFF);
		
		return -1 + 2 * (this.value / 0x3FFF);
	}

	set amount(floating: number)
	{
		if(floating < -1 || floating > 1)
			throw new RangeError("Expected value within -1 to +1");
		
		if(floating > 0)
			this.value = 0x2000 + (Math.round(floating * 0x2000) - 1);
		else
			this.value = Math.round((floating + 1) * 0x2000);
	}
}