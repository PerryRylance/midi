import ReadStream from "../src/streams/ReadStream";

export const getReadStreamFromBytes = (bytes: number[]): ReadStream =>
{
	const arr		= Int8Array.from(bytes);
	const stream	= new ReadStream(arr.buffer);

	return stream;
};