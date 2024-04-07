import { StatusBytes } from "../src/streams/StatusBytes";
import { getReadStreamFromBytes } from "./ReadStreamUtils";
import EventByteArrays from "./EventByteArrays";
import EventFactory from "../src/events/factories/EventFactory";
import NoteOnEvent from "../src/events/control/NoteOnEvent";
import Track from "../src/Track";
import WriteStream from "../src/streams/WriteStream";
import EndOfTrackEvent from "../src/events/meta/EndOfTrackEvent";

test("Parse C Major triad with running status", () => {

	const stream = getReadStreamFromBytes(EventByteArrays.RUNNING_C_MAJOR_TRIAD);
	const status: StatusBytes = [0, 0];
	let c: NoteOnEvent, 
		e: NoteOnEvent, 
		g: NoteOnEvent;

	c = EventFactory.fromStream(stream, status, stream.readVLV()) as NoteOnEvent;

	expect(c).toBeInstanceOf(NoteOnEvent);
	expect(c.channel).toBe(0);
	expect(c.key).toBe(60);
	expect(c.velocity).toBe(127);

	e = EventFactory.fromStream(stream, status, stream.readVLV()) as NoteOnEvent;

	expect(e).toBeInstanceOf(NoteOnEvent);
	expect(e.channel).toBe(0);
	expect(e.key).toBe(64);
	expect(e.velocity).toBe(127);

	g = EventFactory.fromStream(stream, status, stream.readVLV()) as NoteOnEvent;

	expect(g).toBeInstanceOf(NoteOnEvent);
	expect(g.channel).toBe(0);
	expect(g.key).toBe(67);
	expect(g.velocity).toBe(127);

});

test("Serialize C Major triad has running status", () => {

	const track = new Track();
	const stream = new WriteStream();

	for(const key of [60, 64, 67])
	{
		const event		= new NoteOnEvent();
		event.key		= key;
		event.velocity	= 127;

		track.events.push(event);
	}

	// NB: End of track event, to pass validation. Running status is a concept of Track, so this makes sense to have in the test
	track.events.push(new EndOfTrackEvent()); 

	track.writeBytes(stream);

	const buffer = stream.toArrayBuffer();
	const view = new Uint8Array(buffer.slice(8)); // NB: Slice off MTrk and chunk size
	const expected = EventByteArrays.RUNNING_C_MAJOR_TRIAD;

	expect(view.byteLength).toBe(expected.length);

	for(let i = 0; i < view.byteLength; i++)
		expect(view[i]).toBe(expected[i]);

});