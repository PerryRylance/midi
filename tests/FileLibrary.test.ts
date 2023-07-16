import { globSync } from "glob";
import ReadStream from "../src/streams/ReadStream";
import File from "../src/File";
import ParseControlEventError from "../src/exceptions/ParseControlEventError";
import ParseError from "../src/exceptions/ParseError";
import WriteStream from "../src/streams/WriteStream";
import UnsupportedTrackError from "../src/exceptions/UnsupportedTrackError";
import ValidationError from "../src/exceptions/ValidationError";

const files = globSync("./tests/files/*.mid");

function writebackToUint8Array(midi: File)
{
	const stream = new WriteStream();
	midi.writeBytes(stream);
	
	const result = new Uint8Array(stream.toArrayBuffer());
	return result;
}

for(const file of files)
{
	test(`Read and writeback ${file}`, () => {

		const fs			= require("fs");
		const buffer		= fs.readFileSync(file);

		// NB: For some reason, on my machine, trying to get .buffer from the result of readFileSync gives a buffer 8192 bytes in length when I'm reading a file 293 bytes in length, it contains data not present in the file. So we need to convert here. See https://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
		const arrayBuffer	= new ArrayBuffer(buffer.length);
		const view			= new Uint8Array(arrayBuffer);

		for(let i = 0; i < buffer.length; i++)
			view[i] = buffer[i];

		const stream	= new ReadStream(arrayBuffer);
		const midi		= new File();

		const read		= () => midi.readBytes(stream);

		if(/illegal/.test(file))
			expect(read).toThrow(ParseControlEventError);
		else if(/corrupt/.test(file))
			expect(read).toThrow(ParseError);
		else if(/non-midi-track/.test(file))
			expect(read).toThrow(UnsupportedTrackError);
		else
		{
			midi.readBytes(stream);

			const writeback = () => {
				const result = writebackToUint8Array(midi);
				expect(result.byteLength).toBe(view.byteLength);
			};

			if(/test-2-tracks-type-0/.test(file))
				expect(writeback).toThrow(ValidationError);
			else
				writeback();
			
		}

	});
}