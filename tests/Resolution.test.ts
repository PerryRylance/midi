import Resolution, { ResolutionUnits } from "../src/Resolution";
import { FrameRate } from "../src/FrameRate";

test("Default is 480 PPQ", () => {

	const resolution = new Resolution();

	expect(resolution.units).toBe(ResolutionUnits.PPQ);
	expect(resolution.ticksPerQuarterNote).toBe(480);

});

test("PPQ cannot be zero", () => {

	const resolution = new Resolution();

	expect(() => {
		resolution.ticksPerQuarterNote = 0;
	})
		.toThrow(RangeError);

});

test("PPQ cannot be greater than 0x7FFF", () => {

	const resolution = new Resolution();

	expect(() => {
		resolution.ticksPerQuarterNote = 0x8000;
	})
		.toThrow(RangeError);

});

test("PPQ cannot be floating point", () => {

	const resolution = new Resolution();

	expect(() => {
		resolution.ticksPerQuarterNote = 123.456;
	})
		.toThrow(TypeError);

});

test("FPS can be valid frame rates", () => {

	const resolution = new Resolution();

	resolution.setFps(FrameRate.FPS_24, 100);

});

test("FPS cannot be an invalid frame rate", () => {

	const resolution = new Resolution();

	expect(() => {
		resolution.setFps(0x7F as FrameRate, 100);
	})
		.toThrow(RangeError);

});

test("Ticks per frame cannot be zero", () => {

	const resolution = new Resolution();

	resolution.setFps(FrameRate.FPS_24, 100);

	expect(() => {
		resolution.ticksPerFrame = 0;
	})
		.toThrow(RangeError);

});

test("Ticks per frame cannot be greater than 0xFF", () => {

	const resolution = new Resolution();

	resolution.setFps(FrameRate.FPS_24, 100);

	expect(() => {
		resolution.ticksPerFrame = 0x100;
	})
		.toThrow(RangeError);

});

test("Ticks per frame cannot be floating point", () => {

	const resolution = new Resolution();

	resolution.setFps(FrameRate.FPS_24, 100);

	expect(() => {
		resolution.ticksPerFrame = 12.34;
	})
		.toThrow(TypeError);

});

test("Ticks per frame can be valid", () => {

	const resolution = new Resolution();

	resolution.setFps(FrameRate.FPS_24, 100);
	resolution.ticksPerFrame = 128;

});

test("Cannot get PPQ from FPS resolution", () => {

	const resolution = new Resolution();
	resolution.setFps(FrameRate.FPS_24, 100);

	expect(() => {
		return resolution.ticksPerQuarterNote;
	})
		.toThrow(Error);

});

test("Cannot get frames per second from PPQ resolution", () => {

	const resolution = new Resolution();

	expect(() => {
		return resolution.framesPerSecond;
	})
		.toThrow(Error);

});

test("Cannot get ticks per frame from PPQ resolution", () => {

	const resolution = new Resolution();

	expect(() => {
		return resolution.ticksPerFrame;
	})
		.toThrow(Error);

});

test("Can set frames per second independently", () => {

	const resolution = new Resolution();
	resolution.setFps(FrameRate.FPS_24, 100);

	resolution.framesPerSecond = FrameRate.FPS_DROP_30;

});

test("Can set ticks per frame independently", () => {

	const resolution = new Resolution();
	resolution.setFps(FrameRate.FPS_24, 100);

	resolution.ticksPerFrame = 50;

});