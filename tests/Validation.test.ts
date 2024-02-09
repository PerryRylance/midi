import File, { Format } from "../src/File";
import Track from "../src/Track";
import Event from "../src/events/Event";
import NoteOnEvent from "../src/events/control/NoteOnEvent";
import CopyrightEvent from "../src/events/meta/CopyrightEvent";
import EndOfTrackEvent from "../src/events/meta/EndOfTrackEvent";
import SequenceNumberEvent from "../src/events/meta/SequenceNumberEvent";
import TrackNameEvent from "../src/events/meta/TrackNameEvent";
import ValidationError from "../src/exceptions/ValidationError";
import WriteStream from "../src/streams/WriteStream";

const pushCMajorScale = (track: Track) => {

	const keys = [60, 62, 64, 65, 67, 69, 71, 72];
	const delta = 480;

	for(const key of keys)
	{
		const event = new NoteOnEvent(delta);
		event.key = key;

		track.events.push(event);
	}

};

const testEventHasZeroAbsoluteTime = (constructor: (typeof CopyrightEvent | typeof SequenceNumberEvent | typeof TrackNameEvent)) => {

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

test("Cannot exceed maximum number of tracks", () => {

	const stream	= new WriteStream();
	const file		= new File();

	for(let i = 0; i <= 0xFFFF; i++)
		file.tracks.push(new Track());
	
	expect(() => {
		file.writeBytes(stream);
	})
		.toThrow(ValidationError);

});

test("Type 0 MIDI must not have more than one track", () => {

	const stream	= new WriteStream();
	const file		= new File();

	file.format		= Format.TYPE_0;

	for(let i = 0; i < 2; i++)
		file.tracks.push(new Track());

	expect(() => {
		file.writeBytes(stream);
	})
		.toThrow(ValidationError);

});

test("Copyright event cannot occur after first track", () => {

	const stream	= new WriteStream();
	const file		= new File();

	for(let i = 0; i < 2; i++)
		file.tracks.push(new Track());
	
	const event		= new CopyrightEvent();

	file.tracks[1].events.push(event);

	expect(() => {
		file.writeBytes(stream);
	})
		.toThrow(ValidationError);

});