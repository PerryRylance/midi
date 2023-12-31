import ReadStream from "./streams/ReadStream";
import Track from "./Track";
import ParseError from "./exceptions/ParseError";
import WriteStream from "./streams/WriteStream";
import FileValidator from "./validators/FileValidator";

const MThd = 0x4D546864;

export enum Format {
	TYPE_0	= 0,
	TYPE_1	= 1,
	TYPE_2	= 2
};

export default class File
{
	tracks: Track[] = [];
	format: Format = Format.TYPE_1;
	
	private timeDivision: number = 480; // TODO: Support PPQ and FPS

	private readHeader(stream: ReadStream): number
	{
		const signature = stream.readUint();

		if(signature !== MThd)
			throw new ParseError(stream, "Expected MThd");
		
		const size			= stream.readUint();

		if(size !== 6)
			throw new ParseError(stream, "Expected header size to be 6");

		this.format			= stream.readShort();

		const numTracks		= stream.readShort();

		this.timeDivision	= stream.readShort();

		return numTracks;
	}

	readBytes(stream: ReadStream)
	{
		const numTracks	= this.readHeader(stream);

		this.tracks = [];

		for(let i = 0; i < numTracks; i++)
		{
			const track = new Track();
			track.readBytes(stream);

			this.tracks.push(track);
		}

		if(stream.getPosition() < stream.getLength())
			throw new ParseError(stream, "Unexpected data after parsing file");
	}

	writeBytes(stream: WriteStream)
	{
		const validator = new FileValidator(this);

		stream.writeUint(MThd);
		stream.writeUint(0x6); // NB: Size of the following header

		validator.validateTrackCount();

		stream.writeShort(this.format);
		stream.writeShort(this.tracks.length);
		stream.writeShort(this.timeDivision);

		for(let i = 0; i < this.tracks.length; i++)
		{
			const track = this.tracks[i];

			validator.validateTrack(track, i);

			track.writeBytes(stream);
		}
	}
}