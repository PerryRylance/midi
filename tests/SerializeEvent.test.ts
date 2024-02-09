import DeviceManufacturer from "../src/DeviceManufacturer";
import Event from "../src/events/Event";
import AftertouchEvent from "../src/events/control/AftertouchEvent";
import ChannelAftertouchEvent from "../src/events/control/ChannelAftertouchEvent";
import ControllerEvent, { ControllerType } from "../src/events/control/ControllerEvent";
import NoteOffEvent from "../src/events/control/NoteOffEvent";
import NoteOnEvent from "../src/events/control/NoteOnEvent";
import PitchWheelEvent from "../src/events/control/PitchWheelEvent";
import ProgramChangeEvent, { ProgramType } from "../src/events/control/ProgramChangeEvent";
import ChannelPrefixEvent from "../src/events/meta/ChannelPrefixEvent";
import CopyrightEvent from "../src/events/meta/CopyrightEvent";
import CuePointEvent from "../src/events/meta/CuePointEvent";
import EndOfTrackEvent from "../src/events/meta/EndOfTrackEvent";
import InstrumentNameEvent from "../src/events/meta/InstrumentNameEvent";
import KeySignatureEvent, { Quality } from "../src/events/meta/KeySignatureEvent";
import LyricEvent from "../src/events/meta/LyricEvent";
import MarkerEvent from "../src/events/meta/MarkerEvent";
import PortPrefixEvent from "../src/events/meta/PortPrefixEvent";
import SequenceNumberEvent from "../src/events/meta/SequenceNumberEvent";
import SequencerSpecificEvent from "../src/events/meta/SequencerSpecificEvent";
import SetTempoEvent from "../src/events/meta/SetTempoEvent";
import SmtpeOffsetEvent from "../src/events/meta/SmtpeOffsetEvent";
import TextEvent from "../src/events/meta/TextEvent";
import TimeSignatureEvent from "../src/events/meta/TimeSignatureEvent";
import TrackNameEvent from "../src/events/meta/TrackNameEvent";
import SysExEvent from "../src/events/sysex/SysExEvent";
import WriteStream from "../src/streams/WriteStream";
import ByteArrays from "./EventByteArrays";
import { FrameRate } from "../src/FrameRate";

const getUint8ArrayFromEvent = (event: Event) =>
{
	const stream = new WriteStream();
	event.writeBytes(stream);

	const buffer = stream.toArrayBuffer();
	return new Uint8Array(buffer);
};

const doesOutputMatchByteArray = (event: Event, expected: number[]) =>
{
	const output: ArrayBuffer = getUint8ArrayFromEvent(event);

	if(output.byteLength !== expected.length)
		return false;
	
	for(let i = 0; i < expected.length; i++)
		if(output[(i as unknown) as keyof ArrayBuffer] !== expected[i])
			return false;

	return true;
}

test("Serialize text event", () => {

	const event = new TextEvent();
	event.text = "Bass";

	expect(doesOutputMatchByteArray(event, ByteArrays.TEXT)).toBeTruthy();

});

test("Serialize copyright event", () => {

	const event = new CopyrightEvent();
	event.text = "© 2009 Kaliopa Publishing, LLC";

	expect(doesOutputMatchByteArray(event, ByteArrays.COPYRIGHT)).toBeTruthy();

});

test("Serialize track name event", () => {

	const event = new TrackNameEvent();
	event.text = "Bass";

	expect(doesOutputMatchByteArray(event, ByteArrays.TRACK_NAME)).toBeTruthy();

});

test("Serialize instrument name event", () => {

	const event = new InstrumentNameEvent();
	event.text = "Bass";

	expect(doesOutputMatchByteArray(event, ByteArrays.INSTRUMENT_NAME)).toBeTruthy();

});

test("Serialize lyric event", () => {

	const event = new LyricEvent();
	event.text = "la-";
	
	expect(doesOutputMatchByteArray(event, ByteArrays.LYRIC)).toBeTruthy();

});

test("Serialize marker event", () => {

	const event = new MarkerEvent();
	event.text = "Verse";

	expect(doesOutputMatchByteArray(event, ByteArrays.MARKER)).toBeTruthy();

});

test("Serialize cue point event", () => {

	const event = new CuePointEvent();
	event.text = "Solo";

	expect(doesOutputMatchByteArray(event, ByteArrays.CUE_POINT)).toBeTruthy();

});

test("Serialize set tempo event", () => {

	const event = new SetTempoEvent();
	event.bpm = 120;

	expect(doesOutputMatchByteArray(event, ByteArrays.SET_TEMPO)).toBeTruthy();

});

test("Serialize SMTPE offset event", () => {

	const event = new SmtpeOffsetEvent();
	event.rate = FrameRate.FPS_24;
	event.hours = 1;
	event.minutes = 
		event.seconds = 
		event.frames =
		event.subframes = 0;
	
	expect(doesOutputMatchByteArray(event, ByteArrays.SMTPE_OFFSET)).toBeTruthy();

});

test("Serialize sequence number event", () => {

	const event = new SequenceNumberEvent();
	event.number = 2;

	expect(doesOutputMatchByteArray(event, ByteArrays.SEQUENCE_NUMBER)).toBeTruthy();

});

test("Serialize end of track event", () => {

	const event = new EndOfTrackEvent();
	
	expect(doesOutputMatchByteArray(event, ByteArrays.END_OF_TRACK)).toBeTruthy();

});

test("Serialize channel prefix event", () => {

	const event = new ChannelPrefixEvent();
	event.channel = 2;

	expect(doesOutputMatchByteArray(event, ByteArrays.CHANNEL_PREFIX)).toBeTruthy();

});

test("Serialize port prefix event", () => {

	const event = new PortPrefixEvent();
	event.port = 3;

	expect(doesOutputMatchByteArray(event, ByteArrays.PORT_PREFIX)).toBeTruthy();

});

test("Serialize key signature event", () => {

	const event = new KeySignatureEvent();
	event.accidentals = 4;
	event.quality = Quality.MAJOR;

	expect(doesOutputMatchByteArray(event, ByteArrays.KEY_SIGNATURE)).toBeTruthy();

});

test("Serialize time signature event", () => {

	const event = new TimeSignatureEvent();
	event.numerator = 4;
	event.denominator = 4;
	event.ticksPerMetronomeClick = 24;
	event.num32ndNotesPerBeat = 8;

	expect(doesOutputMatchByteArray(event, ByteArrays.TIME_SIGNATURE)).toBeTruthy();

});

test("Serialize sequencer specific event", () => {

	const event = new SequencerSpecificEvent();
	event.manufacturer = DeviceManufacturer.ROLAND;
	event.bytes = new Uint8Array([0x04, 0x01, 0x56]);

	expect(doesOutputMatchByteArray(event, ByteArrays.SEQUENCER_SPECIFIC)).toBeTruthy();

});

test("Serialize sysex event", () => {

	const event = new SysExEvent();
	event.manufacturer = DeviceManufacturer.ROLAND;
	event.bytes = new Uint8Array([0x01, 0x34]);

	expect(doesOutputMatchByteArray(event, ByteArrays.SYSEX)).toBeTruthy();

});

test("Serialize note on event", () => {

	const event = new NoteOnEvent();
	event.channel = 2;
	event.key = 61;
	event.velocity = 120;

	expect(doesOutputMatchByteArray(event, ByteArrays.NOTE_ON)).toBeTruthy();

});

test("Serialize note off event", () => {

	const event = new NoteOffEvent();
	event.channel = 3;
	event.key = 62;
	event.velocity = 120;

	expect(doesOutputMatchByteArray(event, ByteArrays.NOTE_OFF)).toBeTruthy();

});

test("Serialize aftertouch / key pressure event", () => {

	const event = new AftertouchEvent();
	event.channel = 4;
	event.key = 63;
	event.pressure = 121;

	expect(doesOutputMatchByteArray(event, ByteArrays.AFTERTOUCH)).toBeTruthy();

});

test("Serialize controller event", () => {

	const event = new ControllerEvent();
	event.channel = 6;
	event.controller = ControllerType.CHANNEL_VOLUME_COARSE;
	event.value = 16;

	expect(doesOutputMatchByteArray(event, ByteArrays.CONTROLLER)).toBeTruthy();

});

test("Serialize program change event", () => {

	const event = new ProgramChangeEvent();
	event.channel = 6;
	event.program = ProgramType.CLAVINET;

	expect(doesOutputMatchByteArray(event, ByteArrays.PROGRAM_CHANGE)).toBeTruthy();

});

test("Serialize channel aftertouch / channel pressure event", () => {

	const event = new ChannelAftertouchEvent();
	event.channel = 6;
	event.pressure = 53;

	expect(doesOutputMatchByteArray(event, ByteArrays.CHANNEL_AFTERTOUCH)).toBeTruthy();

});

test("Serialize pitch wheel event", () => {

	const event = new PitchWheelEvent();
	event.channel = 3;
	event.value = 0x1CD4;

	expect(doesOutputMatchByteArray(event, ByteArrays.PITCH_WHEEL)).toBeTruthy();

	event.amount = -1;

	expect(event.value).toBe(0x0);

	event.amount = 0;

	expect(event.value).toBe(0x2000);

	event.amount = 1;

	expect(event.value).toBe(0x3FFF);

});