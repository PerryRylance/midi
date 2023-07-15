import ReadStream from "./streams/ReadStream";
import WriteStream from "./streams/WriteStream";
import ParseError from "./exceptions/ParseError";
import { StatusBytes } from "./streams/StatusBytes";
import Event from "./events/Event";
import EventFactory from "./events/factories/EventFactory";
import EndOfTrackEvent from "./events/meta/EndOfTrackEvent";
import ControlEvent from "./events/control/ControlEvent";
import UnsupportedTrackError from "./exceptions/UnsupportedTrackError";

const MTrk		= 0x4D54726B;

export default class Track
{
	events: Event[] = [];

	readBytes(stream: ReadStream)
	{
		if(stream.readUint() !== MTrk)
			throw new UnsupportedTrackError(stream, "Expected MTrk, only MIDI tracks are supported presently");
		
		const chunkSize = stream.readUint();
		const status: StatusBytes = [0, 0];

		let bytes = 0, cursor = 0, eot = false;
		let event: Event;

		while(bytes < chunkSize)
		{
			if(eot)
				throw new ParseError(stream, "Unexpected end of track event");

			cursor	= stream.getPosition();
			event	= EventFactory.fromStream(stream, status);

			if(!(event instanceof ControlEvent))
				status[0] = status[1] = 0; // NB: Not on a control event, reset status bytes
			
			if(event instanceof EndOfTrackEvent)
				eot = true;
			
			this.events.push(event);

			bytes += stream.getPosition() - cursor;
		}

		if(!eot)
			throw new ParseError(stream, "Expected end of track event");
		
		if(bytes < chunkSize)
			throw new ParseError(stream, "Expected bytes read to be equal to specified chunk size");
	}

	writeBytes(stream: WriteStream)
	{
		stream.writeUint(MTrk);

		const chunkSizePosition = stream.getPosition();

		stream.writeUint(0); // NB: Temporarily write zero for chunk size, we'll alter this later

		const status: StatusBytes = [0, 0];

		for(const event of this.events)
		{
			event.writeBytes(stream, status);

			if(!(event instanceof ControlEvent))
				status[0] = status[1] = 0; // NB: Reset status bytes
		}
		
		const trackEndPosition = stream.getPosition();
		const chunkSize = trackEndPosition - chunkSizePosition - 4; // NB: Delta bytes minus the 4 bytes for the chunk size uint itself

		stream.seekTo(chunkSizePosition);
		stream.writeUint(chunkSize);

		stream.seekTo(trackEndPosition);
	}
}