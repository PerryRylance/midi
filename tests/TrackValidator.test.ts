import Track from "../src/Track";
import NoteOnEvent from "../src/events/control/NoteOnEvent";
import CopyrightEvent from "../src/events/meta/CopyrightEvent";
import EndOfTrackEvent from "../src/events/meta/EndOfTrackEvent";
import SequenceNumberEvent from "../src/events/meta/SequenceNumberEvent";
import TrackNameEvent from "../src/events/meta/TrackNameEvent";
import ValidationError from "../src/exceptions/ValidationError";
import WriteStream from "../src/streams/WriteStream";

const pushCMajorScale = track => {

	const keys = [60, 62, 64, 65, 67, 69, 71, 72];
	const delta = 480;

	for(const key of keys)
	{
		const event = new NoteOnEvent(delta);
		event.key = key;

		track.events.push(event);
	}

};

const testEventHasZeroAbsoluteTime = (constructor) => {

	const stream		= new WriteStream();
	const track			= new Track();

	pushCMajorScale(track);

	const copyright		= new constructor();
	
	track.events.push(copyright);

	expect(() => {
		track.writeBytes(stream);
	})
		.toThrow(ValidationError);

};

test("Validation fails on premature end of track event", () => {

	const stream		= new WriteStream();
	const track			= new Track();
	const endOfTrack	= new EndOfTrackEvent();

	pushCMajorScale(track);

	track.events.unshift(endOfTrack);

	expect(() => {
		track.writeBytes(stream);
	})
		.toThrow(ValidationError);

});

test("Validation fails on missing end of track event", () => {

	const stream		= new WriteStream();
	const track			= new Track();

	pushCMajorScale(track);

	expect(() => {
		track.writeBytes(stream);
	})
		.toThrow(ValidationError);

});

test("Copyright event cannot have non-zero absolute time", () => testEventHasZeroAbsoluteTime(CopyrightEvent));
test("Sequence number event cannot have non-zero absolute time", () => testEventHasZeroAbsoluteTime(SequenceNumberEvent));
test("Track name event cannot have non-zero absolute time", () => testEventHasZeroAbsoluteTime(TrackNameEvent));