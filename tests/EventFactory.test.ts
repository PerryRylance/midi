import ReadStream from "../src/streams/ReadStream"
import EventFactory from "../src/events/factories/EventFactory";
import CopyrightEvent from "../src/events/meta/CopyrightEvent";
import TextEvent from "../src/events/meta/TextEvent";
import ParseError from "../src/exceptions/ParseError";
import EventByteArrays from "./EventByteArrays";
import TrackNameEvent from "../src/events/meta/TrackNameEvent";
import InstrumentNameEvent from "../src/events/meta/InstrumentNameEvent";
import LyricEvent from "../src/events/meta/LyricEvent";
import MarkerEvent from "../src/events/meta/MarkerEvent";
import CuePointEvent from "../src/events/meta/CuePointEvent";
import SetTempoEvent from "../src/events/meta/SetTempoEvent";
import SmtpeOffsetEvent from "../src/events/meta/SmtpeOffsetEvent";
import SequenceNumberEvent from "../src/events/meta/SequenceNumberEvent";
import EndOfTrackEvent from "../src/events/meta/EndOfTrackEvent";
import ChannelPrefixEvent from "../src/events/meta/ChannelPrefixEvent";
import PortPrefixEvent from "../src/events/meta/PortPrefixEvent";
import SequencerSpecificEvent from "../src/events/meta/SequencerSpecificEvent";
import MetaEvent from "../src/events/meta/MetaEvent";
import DeviceManufacturer from "../src/DeviceManufacturer";
import SysExEvent from "../src/events/sysex/SysExEvent";
import NoteOnEvent from "../src/events/control/NoteOnEvent";
import NoteOffEvent from "../src/events/control/NoteOffEvent";
import AftertouchEvent from "../src/events/control/AftertouchEvent";
import ControllerEvent, { ControllerType } from "../src/events/control/ControllerEvent";
import ProgramChangeEvent, { ProgramType } from "../src/events/control/ProgramChangeEvent";
import ChannelAftertouchEvent from "../src/events/control/ChannelAftertouchEvent";
import PitchWheelEvent from "../src/events/control/PitchWheelEvent";
import { FrameRate } from "../src/FrameRate";

import { getReadStreamFromBytes } from "./ReadStreamUtils";
import KeySignatureEvent, { Quality } from "../src/events/meta/KeySignatureEvent";
import TimeSignatureEvent from "../src/events/meta/TimeSignatureEvent";

const getEventFromByteArray = <T>(bytes: number[]): T => {

	const stream = getReadStreamFromBytes(bytes);
	return EventFactory.fromStream(stream, [0, 0]) as T;

};

test("Read text event", () => {

	const event = getEventFromByteArray<TextEvent>(EventByteArrays.TEXT);

	expect(event).toBeInstanceOf(TextEvent);
	expect(event.text).toEqualValue("Bass");

});

test("Throw on bad text event", () => {

	expect(() => getEventFromByteArray<TextEvent>(EventByteArrays.INVALID_TEXT)).toThrow(ParseError);

});

test("Read copyright event", () => {

	const event = getEventFromByteArray<CopyrightEvent>(EventByteArrays.COPYRIGHT);

	expect(event).toBeInstanceOf(CopyrightEvent);
	expect(event.text).toEqualValue("© 2009 Kaliopa Publishing, LLC");

});

test("Read track name event", () => {

	const event = getEventFromByteArray<TrackNameEvent>(EventByteArrays.TRACK_NAME);

	expect(event).toBeInstanceOf(TrackNameEvent);
	expect(event.text).toEqualValue("Bass");

});

test("Read instrument name event", () => {

	const event = getEventFromByteArray<InstrumentNameEvent>(EventByteArrays.INSTRUMENT_NAME);

	expect(event).toBeInstanceOf(InstrumentNameEvent);
	expect(event.text).toEqualValue("Bass");

});

test("Read lyric event", () => {

	const event = getEventFromByteArray<LyricEvent>(EventByteArrays.LYRIC);

	expect(event).toBeInstanceOf(LyricEvent);
	expect(event.text).toEqualValue("la-");

});

test("Read marker event", () => {

	const event = getEventFromByteArray<MarkerEvent>(EventByteArrays.MARKER);

	expect(event).toBeInstanceOf(MarkerEvent);
	expect(event.text).toEqualValue("Verse");

});

test("Read cue point event", () => {

	const event = getEventFromByteArray<CuePointEvent>(EventByteArrays.CUE_POINT);

	expect(event).toBeInstanceOf(CuePointEvent);
	expect(event.text).toEqualValue("Solo");

});

test("Read set tempo event", () => {

	const event = getEventFromByteArray<SetTempoEvent>(EventByteArrays.SET_TEMPO);

	expect(event).toBeInstanceOf(SetTempoEvent);
	expect(event.bpm).toEqualValue(120);

});

test("Read SMTPE offset event", () => {

	const event = getEventFromByteArray<SmtpeOffsetEvent>(EventByteArrays.SMTPE_OFFSET);

	expect(event).toBeInstanceOf(SmtpeOffsetEvent);
	expect(event.rate).toEqualValue(FrameRate.FPS_24);
	expect(event.hours).toEqualValue(1);
	expect(event.minutes).toEqualValue(0);
	expect(event.seconds).toEqualValue(0);
	expect(event.frames).toEqualValue(0);
	expect(event.subframes).toEqualValue(0);

});

test("Read sequence number event", () => {

	const event = getEventFromByteArray<SequenceNumberEvent>(EventByteArrays.SEQUENCE_NUMBER);

	expect(event.number).toEqualValue(2);

});

test("Read end of track event", () => {

	const event = getEventFromByteArray<EndOfTrackEvent>(EventByteArrays.END_OF_TRACK);

	expect(event).toBeInstanceOf(EndOfTrackEvent);

});

test("Read channel prefix event", () => {

	const event = getEventFromByteArray<ChannelPrefixEvent>(EventByteArrays.CHANNEL_PREFIX);

	expect(event).toBeInstanceOf(ChannelPrefixEvent);
	expect(event.channel).toEqualValue(2);

});

test("Read port prefix event", () => {

	const event = getEventFromByteArray<PortPrefixEvent>(EventByteArrays.PORT_PREFIX);

	expect(event).toBeInstanceOf(PortPrefixEvent);
	expect(event.port).toEqualValue(3);

});

test("Read key signature event", () => {

	const event = getEventFromByteArray<KeySignatureEvent>(EventByteArrays.KEY_SIGNATURE);

	expect(event).toBeInstanceOf(KeySignatureEvent);
	expect(event.accidentals).toEqualValue(4);
	expect(event.quality).toEqualValue(Quality.MAJOR);

});

test("Read time signature event", () => {

	const event = getEventFromByteArray<TimeSignatureEvent>(EventByteArrays.TIME_SIGNATURE);

	expect(event).toBeInstanceOf(TimeSignatureEvent);
	expect(event.numerator).toEqualValue(4);
	expect(event.denominator).toEqualValue(4);
	expect(event.ticksPerMetronomeClick).toEqualValue(24);
	expect(event.num32ndNotesPerBeat).toEqualValue(8);

});

test("Read sequencer specific event", () => {

	const event = getEventFromByteArray<SequencerSpecificEvent>(EventByteArrays.SEQUENCER_SPECIFIC);

	expect(event).toBeInstanceOf(SequencerSpecificEvent);
	expect(event.manufacturer).toEqualValue(DeviceManufacturer.ROLAND);
	expect(event.bytes.length).toBe(3);

});

test("Read invalid meta event type", () => {

	expect(() => getEventFromByteArray<MetaEvent>(EventByteArrays.INVALID_META_EVENT_TYPE)).toThrow(ParseError);

});

test("Read sysex event", () => {

	const event = getEventFromByteArray<SysExEvent>(EventByteArrays.SYSEX);

	expect(event).toBeInstanceOf(SysExEvent);
	expect(event.manufacturer).toEqualValue(DeviceManufacturer.ROLAND);
	expect(event.bytes.byteLength).toBe(2);

});

test("Read note on event", () => {

	const event = getEventFromByteArray<NoteOnEvent>(EventByteArrays.NOTE_ON);

	expect(event).toBeInstanceOf(NoteOnEvent);
	expect(event.channel).toEqualValue(2);
	expect(event.key).toEqualValue(61);
	expect(event.velocity).toEqualValue(120);

});

test("Read note off event", () => {

	const event = getEventFromByteArray<NoteOffEvent>(EventByteArrays.NOTE_OFF);

	expect(event).toBeInstanceOf(NoteOffEvent);
	expect(event.channel).toEqualValue(3);
	expect(event.key).toEqualValue(62);
	expect(event.velocity).toEqualValue(120);

});

test("Read aftertouch / key pressure event", () => {

	const event = getEventFromByteArray<AftertouchEvent>(EventByteArrays.AFTERTOUCH);

	expect(event).toBeInstanceOf(AftertouchEvent);
	expect(event.channel).toEqualValue(4);
	expect(event.key).toEqualValue(63);
	expect(event.pressure).toEqualValue(121);

});

test("Read controller event", () => {

	const event = getEventFromByteArray<ControllerEvent>(EventByteArrays.CONTROLLER);

	expect(event).toBeInstanceOf(ControllerEvent);
	expect(event.channel).toEqualValue(6);
	expect(event.controller).toEqualValue(ControllerType.CHANNEL_VOLUME_COARSE);
	expect(event.value).toEqualValue(16);

});

test("Read program change event", () => {

	const event = getEventFromByteArray<ProgramChangeEvent>(EventByteArrays.PROGRAM_CHANGE);

	expect(event).toBeInstanceOf(ProgramChangeEvent);
	expect(event.channel).toEqualValue(6);
	expect(event.program).toEqualValue(ProgramType.CLAVINET);

});

test("Read channel aftertouch / channel pressure event", () => {

	const event = getEventFromByteArray<ChannelAftertouchEvent>(EventByteArrays.CHANNEL_AFTERTOUCH);

	expect(event).toBeInstanceOf(ChannelAftertouchEvent);
	expect(event.channel).toEqualValue(6);
	expect(event.pressure).toEqualValue(53);

});

test("Read pitch wheel event", () => {

	const event = getEventFromByteArray<PitchWheelEvent>(EventByteArrays.PITCH_WHEEL);

	expect(event).toBeInstanceOf(PitchWheelEvent);
	expect(event.channel).toEqualValue(3);
	expect(event.value).toEqualValue(0x1CD4);

});