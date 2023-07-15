import ReadStream from "../streams/ReadStream";
export default class ParseError extends Error
{
	constructor(stream: ReadStream, message: string)
	{
		super(`${message} near stream position 0x${stream.getPosition().toString(16)}`);
	}
}