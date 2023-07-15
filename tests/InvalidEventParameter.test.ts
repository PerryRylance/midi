import ChannelPrefixEvent from "../src/events/meta/ChannelPrefixEvent";
import CopyrightEvent from "../src/events/meta/CopyrightEvent";
import CuePointEvent from "../src/events/meta/CuePointEvent";
import InstrumentNameEvent from "../src/events/meta/InstrumentNameEvent";
import KeySignatureEvent from "../src/events/meta/KeySignatureEvent";
import LyricEvent from "../src/events/meta/LyricEvent";
import MarkerEvent from "../src/events/meta/MarkerEvent";
import TextEvent from "../src/events/meta/TextEvent";
import TimeSignatureEvent from "../src/events/meta/TimeSignatureEvent";
import TrackNameEvent from "../src/events/meta/TrackNameEvent";
import AftertouchEvent from "../src/events/control/AftertouchEvent";
import ChannelAftertouchEvent from "../src/events/control/ChannelAftertouchEvent";
import NoteOnEvent from "../src/events/control/NoteOnEvent";
import NoteOffEvent from "../src/events/control/NoteOffEvent";
import ControllerEvent from "../src/events/control/ControllerEvent";
import ProgramChangeEvent from "../src/events/control/ProgramChangeEvent";
import PitchWheelEvent from "../src/events/control/PitchWheelEvent";

const TEXT_EVENT_CLASSES = [
	TextEvent,
	CopyrightEvent,
	TrackNameEvent,
	InstrumentNameEvent,
	LyricEvent,
	MarkerEvent,
	CuePointEvent
];

test("Negative event delta throws range error", () => {

	expect(() => {

		const event = new TextEvent();
		event.delta = -1;

	})
		.toThrow(RangeError);

});

test("Floating point event delta throws error", () => {

	expect(() => {

		const event = new TextEvent();
		event.delta = Math.PI;

	})
		.toThrow(Error);

});

test("Delta VLV larger than 4 bytes throws error", () => {

	expect(() => {

		const event = new TextEvent();
		event.delta = 0xFFFFFFFF;

	})
		.toThrow(RangeError);

});

test("Channel prefix negative channel throws range error", () => {

	expect(() => {

		const event = new ChannelPrefixEvent();
		event.channel = -1;

	})
		.toThrow(RangeError);

});

test("Channel prefix channel too high throws range error", () => {

	expect(() => {

		const event = new ChannelPrefixEvent();
		event.channel = 255;

	})
		.toThrow(RangeError);

});

test("Text events text cannot exceed length 255", () => {

	const tooLongText = "a".repeat(256);

	for(const constructor of TEXT_EVENT_CLASSES)
	{
		const event = new constructor();

		expect(() => event.text = tooLongText).toThrow(RangeError);
	}

});

test("Text events text cannot contain non-ASCII characters", () => {

	expect(() => {

		const event = new TextEvent();
		event.text = "🦓";

	})
		.toThrow(RangeError);

});

test("Key signature cannot have invalid sharps / flats", () => {

	expect(() => {

		const event = new KeySignatureEvent();
		event.accidentals = -8;

	})
		.toThrow(RangeError);

	expect(() => {

		const event = new KeySignatureEvent();
		event.accidentals = 8;

	})
		.toThrow(RangeError);

});

test("Time signature must have positive, non-zero numerator", () => {

	expect(() => {

		const event = new TimeSignatureEvent();
		event.numerator = 0;

	})
		.toThrow(RangeError);

	expect(() => {

		const event = new TimeSignatureEvent();
		event.numerator = 256;

	})
		.toThrow(RangeError);

	expect(() => {

		const event = new TimeSignatureEvent();
		event.numerator = 0;

	})
		.toThrow(RangeError);

});

test("Time signature cannot have invalid denominator", () => {

	expect(() => {

		const event = new TimeSignatureEvent();
		event.denominator = 3;

	})
		.toThrow(Error);

});

test("Time signature cannot have zero ticks per metronome click", () => {

	expect(() => {

		const event = new TimeSignatureEvent();
		event.ticksPerMetronomeClick = 0;

	})
		.toThrow(RangeError);

});

test("Time signature cannot have 256 ticks per metronome click", () => {

	expect(() => {

		const event = new TimeSignatureEvent();
		event.ticksPerMetronomeClick = 256;

	})
		.toThrow(RangeError);

});

test("Time signature cannot have zero 32nd notes per beat", () => {

	expect(() => {

		const event = new TimeSignatureEvent();
		event.num32ndNotesPerBeat = 0;

	})
		.toThrow(RangeError);

});

test("Time signature cannot have 256 32nd notes per beat", () => {

	expect(() => {

		const event = new TimeSignatureEvent();
		event.num32ndNotesPerBeat = 256;

	})
		.toThrow(RangeError);

});

// NB: All control events have a delta and a channel
for(const identifier of [
	AftertouchEvent,
	ChannelAftertouchEvent,
	NoteOnEvent,
	NoteOffEvent,
	ControllerEvent,
	PitchWheelEvent,
	ProgramChangeEvent
])
{
	const instance = new identifier();
	const name = instance.constructor.name;

	test(`${name} cannot have negative delta`, 			() => expect(() => instance.delta = -1).toThrow(RangeError));
	test(`${name} cannot have floating point delta`, 	() => expect(() => instance.delta = 1.234).toThrow(TypeError));
	test(`${name} cannot have delta above 0x0FFFFFFF`,	() => expect(() => instance.delta = 0xFFFFFFFF).toThrow(RangeError));

	test(`${name} cannot have negative channel`,		() => expect(() => instance.channel = -1).toThrow(RangeError));
	test(`${name} cannot have floating point channel`,	() => expect(() => instance.channel = 1.234).toThrow(TypeError));
	test(`${name} cannot have channel above 0x10`,		() => expect(() => instance.channel = 0x10).toThrow(RangeError));
}

for(const identifier of [
	AftertouchEvent,
	NoteOnEvent,
	NoteOffEvent
])
{
	const instance = new identifier();
	const name = instance.constructor.name;

	test(`${name} cannot have negative key`,			() => expect(() => instance.key = -1).toThrow(RangeError));
	test(`${name} cannot have floating point key`,		() => expect(() => instance.key = 60.123).toThrow(TypeError));
	test(`${name} cannot have key above 0xFF`,			() => expect(() => instance.key = 128).toThrow(RangeError));
}

for(const identifier of [
	NoteOnEvent,
	NoteOffEvent
])
{
	const instance = new identifier();
	const name = instance.constructor.name;

	test(`${name} cannot have negative velocity`,		() => expect(() => instance.velocity = -1).toThrow(RangeError));
	test(`${name} cannot have floating point velocity`,	() => expect(() => instance.velocity = 60.123).toThrow(TypeError));
	test(`${name} cannot have velocity above 0xFF`,		() => expect(() => instance.velocity = 128).toThrow(RangeError));
}

for(const identifier of [
	AftertouchEvent,
	ChannelAftertouchEvent
])
{
	const instance = new identifier();
	const name = instance.constructor.name;

	test(`${name} cannot have negative pressure`,		() => expect(() => instance.pressure = -1).toThrow(RangeError));
	test(`${name} cannot have floating point pressure`,	() => expect(() => instance.pressure = 60.123).toThrow(TypeError));
	test(`${name} cannot have pressure above 0xFF`,		() => expect(() => instance.pressure = 128).toThrow(RangeError));
}

test("Pitch wheel cannot have amount less than negative one", () => {

	expect(() => {

		const event = new PitchWheelEvent();
		event.amount = -1.1;

	})
		.toThrow(RangeError);

});

test("Pitch wheel cannot have amount more than positive one", () => {

	expect(() => {

		const event = new PitchWheelEvent();
		event.amount = 1.1;

	})
		.toThrow(RangeError);

});

// TODO: Probably need to test for NaN