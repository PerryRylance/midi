import ReadStream from "./streams/ReadStream";
import WriteStream from "./streams/WriteStream";
import ParseError from "./exceptions/ParseError";
import { StatusBytes } from "./streams/StatusBytes";
import Event from "./events/Event";
import EventFactory from "./events/factories/EventFactory";
import EndOfTrackEvent from "./events/meta/EndOfTrackEvent";
import ControlEvent from "./events/control/ControlEvent";
import UnsupportedTrackError from "./exceptions/UnsupportedTrackError";
import TrackValidator from "./validators/TrackValidator";
import { CallableArray, createCallableArray, adoptCallableArray } from "./CallableArray";
import Probeable from "./Probeable";

const MTrk		= 0x4D54726B;

export type WriteOptions = {
	// NB: Removes any existing end of track events and appends one to the end, preserving delta. This will mutate the track's events.
	autoEndOfTrackEvents?: boolean;
};

export default class Track extends Probeable
{
	private readonly _eventsArray: CallableArray<Event, this> = createCallableArray<Event, this>(this);

	get events(): CallableArray<Event, this>
	{
		return this._eventsArray;
	}

	set events(value: Event[])
	{
		adoptCallableArray(this._eventsArray, value);
	}

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

			const delta = stream.readVLV();

			event	= EventFactory.fromStream(stream, status, delta);

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
		const validator = new TrackValidator(this);

		stream.writeUint(MTrk);

		const chunkSizePosition = stream.getPosition();

		stream.writeUint(0); // NB: Temporarily write zero for chunk size, we'll alter this later

		const status: StatusBytes = [0, 0];

		for(let i = 0; i < this.events.length; i++)
		{
			const event = this.events[i];

			validator.validateEvent(event, i);

			// NB: Delta written here. Delta is a track concept and not related to pure events. We do this here so that events can be streamed in real time.
			stream.writeVLV(event.delta);

			event.writeBytes(stream, status);

			if(!(event instanceof ControlEvent))
				status[0] = status[1] = 0; // NB: Reset status bytes
		}
		
		const trackEndPosition = stream.getPosition();
		const chunkSize = trackEndPosition - chunkSizePosition - 4; // NB: Delta bytes minus the 4 bytes for the chunk size uint itself

		validator.validateSize(chunkSize);

		stream.seekTo(chunkSizePosition);
		stream.writeUint(chunkSize);

		stream.seekTo(trackEndPosition);
	}

	fixEndOfTrack(): this
	{
		const events = this.events;
		let accumulatedDelta = 0;

		// NB: First, pass the delta of any stray end of track events on to the next non-end of track event
		for(let i = 0; i < events.length; i++)
		{
			const event = events[i];

			if(event instanceof EndOfTrackEvent)
			{
				accumulatedDelta += event.delta;
				continue;
			}

			event.delta += accumulatedDelta;
			accumulatedDelta = 0;
		}

		// NB: Now strip out all end of track events
		const filtered = events.filter(event => !(event instanceof EndOfTrackEvent));

		// NB: If the accumulated delta is non-zero it's accumulated from the old final end of track event, put it back
		filtered.push(new EndOfTrackEvent(accumulatedDelta));

		// NB: Update the tracks events
		this.events(filtered);

		return this;
	}
}
