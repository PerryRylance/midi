import ReadStream from "./streams/ReadStream";
import WriteStream from "./streams/WriteStream";

import { FrameRate } from "./FrameRate";

export enum ResolutionUnits {
	PPQ = "ppq",
	FPS = "fps"
};

export default class Resolution
{
	private value: number = 480;

	private getFrameRateFromShort(value: number): number
	{
		return (value & 0x7FFF) >> 8;
	}

	readBytes(stream: ReadStream): void
	{
		const value = stream.readShort();

		if((0x8000 & value) === 0x8000 && !(this.getFrameRateFromShort(value) in FrameRate))
			throw new RangeError("Invalid frame rate");

		this.value = value;
	}

	writeBytes(stream: WriteStream): void
	{
		stream.writeShort(this.value);
	}

	get units(): ResolutionUnits
	{
		return (0x8000 & this.value) === 0x8000 ? ResolutionUnits.FPS : ResolutionUnits.PPQ;
	}

	get ticksPerQuarterNote(): number
	{
		if(this.units !== ResolutionUnits.PPQ)
			throw new Error("Cannot get PPQ from FPS resolution");

		return this.value;
	}

	set ticksPerQuarterNote(value: number)
	{
		if(value < 1)
			throw new RangeError("PPQ must be non-zero");

		if((value & 0x8000) === 0x8000)
			throw new RangeError("PPQ cannot exceed 0x8000 (32,768)");

		if(!Number.isInteger(value))
			throw new TypeError("PPQ must be an integer");

		this.value = value;
	}

	get framesPerSecond(): FrameRate
	{
		if(this.units !== ResolutionUnits.FPS)
			throw new Error("Cannot get FPS from PPQ resolution");

		return (this.value & 0x7FFF) >> 8;
	}

	set framesPerSecond(value: FrameRate)
	{
		if(this.units !== ResolutionUnits.FPS)
			throw new Error("Cannot set FPS on PPQ resolution, did you mean to use the setFps method?")
	
		this.setFps(value, this.ticksPerFrame);
	}

	get ticksPerFrame(): number
	{
		if(this.units !== ResolutionUnits.FPS)
			throw new Error("Cannot get ticks-per-frame from PPQ resolution");

		return this.value & 0xFF;
	}

	set ticksPerFrame(value: number)
	{
		if(this.units !== ResolutionUnits.FPS)
			throw new Error("Cannot set ticks-per-frame on PPQ resolution, did you mean to use the setFps method?");

		this.setFps(this.framesPerSecond, value);
	}

	setFps(framesPerSecond: FrameRate, ticksPerFrame: number): void
	{
		if(!(framesPerSecond in FrameRate))
			throw new RangeError("Invalid frame rate");

		if(ticksPerFrame < 1)
			throw new RangeError("Ticks per frame must be non-zero");

		if(ticksPerFrame > 0xFF)
			throw new RangeError("Ticks per frame cannot exceed 0xFF (255)");

		if(!Number.isInteger(ticksPerFrame))
			throw new TypeError("Ticks per frame must be an integer");

		this.value = 0x8000 | (0x7F00 & (framesPerSecond << 8)) | ticksPerFrame;
	}
}