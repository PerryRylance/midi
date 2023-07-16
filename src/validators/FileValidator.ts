import File, { Format } from "../File";
import Track from "../Track";
import CopyrightEvent from "../events/meta/CopyrightEvent";
import ValidationError from "../exceptions/ValidationError";

export default class FileValidator
{
	private file: File;

	constructor(file: File)
	{
		this.file = file;
	}

	validateTrackCount()
	{
		if(this.file.format === Format.TYPE_0 && this.file.tracks.length > 1)
			throw new ValidationError("MIDI type 0 must have exactly one track");

		if(this.file.tracks.length > 0xFFFF)
			throw new ValidationError("Maximum number of tracks exceeded");
	}

	validateTrack(track: Track, index: number)
	{
		if(index > 0)
		{
			if(track.events.find(event => (event instanceof CopyrightEvent)))
				throw new ValidationError("Event must be on first track");
		}
	}
}