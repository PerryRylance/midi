import ParseError from "../../exceptions/ParseError";
import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";

import MetaEvent, { MetaEventType } from "./MetaEvent";

export enum Rate {
	FPS_24		= 0x0,
	FPS_25		= 0x1,
	FPS_DROP_30	= 0x2,
	FPS_30		= 0x3
};

export default class SmtpeOffsetEvent extends MetaEvent
{
	rate: Rate = Rate.FPS_24;
	hours: number = 1;
	minutes: number = 0;
	seconds: number = 0;
	frames: number = 0;
	subframes: number = 0;

	// TODO: Private and test parameters please
	// TODO: See spec http://www.somascape.org/midi/tech/mfile.html#:~:text=SMPTE%20Offset,-FF%2054%2005&text=ff%20is%20a%20byte%20specifying,prior%20to%20any%20MIDI%20events.

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
		switch(this.rate)
		{
			case Rate.FPS_24:
			case Rate.FPS_25:
			case Rate.FPS_DROP_30:
			case Rate.FPS_30:
				break;
			
			default:
				throw new ParseError(stream, "Invalid SMTPE rate");
		}

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