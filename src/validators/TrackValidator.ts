import Track from "../Track";
import Event from "../events/Event";
import CopyrightEvent from "../events/meta/CopyrightEvent";
import EndOfTrackEvent from "../events/meta/EndOfTrackEvent";
import SequenceNumberEvent from "../events/meta/SequenceNumberEvent";
import TrackNameEvent from "../events/meta/TrackNameEvent";
import ValidationError from "../exceptions/ValidationError";

export default class TrackValidator
{
	private track: Track;

	constructor(track: Track)
	{
		this.track = track;
	}

	private validateZeroAbsoluteTime(index: number): void
	{
		for(let i = index; i >= 0; i--)
			if(this.track.events[i].delta > 0)
				throw new ValidationError("Event must have zero delta time and cannot occur after non-zero delta time events");
	}

	validateEvent(event: Event, index: number): void
	{
		if(event instanceof EndOfTrackEvent && index !== this.track.events.length - 1)
			throw new ValidationError("Premature end of track event");
		
		if(index === this.track.events.length - 1 && !(event instanceof EndOfTrackEvent))
			throw new ValidationError("Expected end of track");
		
		if(
			event instanceof CopyrightEvent ||
			event instanceof SequenceNumberEvent ||
			event instanceof TrackNameEvent
		)
		{
			this.validateZeroAbsoluteTime(index);
		}
	}

	validateSize(size: number): void
	{
		if(size > 0xFFFFFFFF)
			throw new ValidationError("Track size overflow");
	}
}