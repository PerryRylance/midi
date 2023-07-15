import Stream from "./Stream";
import ParseError from "../exceptions/ParseError";

export default class ReadStream extends Stream
{
	private dataView: DataView;

	constructor(buffer: ArrayBuffer)
	{
		super();

		this.dataView = new DataView(buffer);
	}

	getLength(): number
	{
		return this.dataView.byteLength;
	}

	readByte()
	{
		if(this.position >= this.dataView.byteLength)
			throw new ParseError(this, "Unexpected end of stream");

		const result = this.dataView!.getUint8(this.position);
		this.position++;
		return result;
	}

	readShort()
	{
		if(this.position >= this.dataView.byteLength - 1)
			throw new ParseError(this, "Unexpected end of stream");

		const result = this.dataView!.getUint16(this.position);
		this.position += 2;
		return result;
	}

	readUint()
	{
		if(this.position >= this.dataView.byteLength - 3)
			throw new ParseError(this, "Unexpected end of stream");

		const result = this.dataView!.getUint32(this.position);
		this.position += 4;
		return result;
	}

	readVLV()
	{
		let value, c;

		try{

			if((value = this.readByte()) & 0x80)
			{
				value &= 0x7F;
				do {
					value = (value << 7) + ((c = this.readByte()) & 0x7F);
				}while(c & 0x80);
			}

		}catch(e) {

			if(e instanceof RangeError)
				throw new ParseError(this, "Unexpected end of stream");
			
			throw e;

		}

		return value;
	}

	assertPositionValid(): void
	{
		if(this.position >= 0 && this.position < this.dataView.byteLength)
			return;
		
		throw new RangeError("Invalid stream position");
	}

	seekRelative(relative: number): void
	{
		this.position += relative;

		if(this.position < 0 || this.position >= this.dataView.byteLength)
			throw new RangeError("Seeked out of bounds");

		this.assertPositionValid();
	}
}