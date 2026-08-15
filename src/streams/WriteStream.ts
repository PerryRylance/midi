import Stream from "./Stream";

export default class WriteStream extends Stream
{
	private buffer: number[];

	constructor()
	{
		super();

		this.buffer = [];
	}

	writeByte(value: number)
	{
		// NB: Number(value) rather than a bare assignment - value may be a callable/coercible
		// accessor (e.g. event.channel) rather than a true number primitive. Bitwise/arithmetic
		// ops elsewhere coerce implicitly, but a plain assignment into this.buffer (a plain
		// number[], not a typed array) does not, so we coerce explicitly at this choke point.
		this.buffer[this.position] = Number(value);
		this.position++;
	}

	writeSignedByte(value: number)
	{
		if(value < -128 || value > 127)
			throw new RangeError("Signed byte out of range");

		const normalized = Number(value);

		this.buffer[this.position] = normalized < 0 ? 0xFF + normalized : normalized;
		this.position++;
	}

	writeShort(value: number)
	{
		this.buffer[this.position] = (value & 0xFF00) >> 8;
		this.buffer[this.position + 1] = (value & 0xFF);
		this.position += 2;
	}

	writeUint(value: number)
	{
		this.buffer[this.position] = (value & 0xFF000000) >> 24;
		this.buffer[this.position + 1] = (value & 0xFF0000) >> 16;
		this.buffer[this.position + 2] = (value & 0xFF00) >> 8;
		this.buffer[this.position + 3] = (value & 0xFF);
		this.position += 4;
	}

	writeVLV(value: number)
	{
		let buffer = value & 0x7F;

		while ((value >>= 7) > 0) {
			buffer <<= 8;
			buffer |= 0x80;
			buffer += (value & 0x7F);
		}

		while (1) {
			this.writeByte(buffer);

			if (buffer & 0x80)
				buffer >>= 8;
			else
				break;
		}
	}

	seekTo(position: number): void
	{
		if(!Number.isInteger(position))
			throw new TypeError("Position must be an integer");

		if(position < 0 || position > this.buffer.length)
			throw new RangeError("Cannot seek to 0x" + position.toString(16));
		
		this.position = position;
	}

	toArrayBuffer(): ArrayBuffer
	{
		const buffer = new ArrayBuffer(this.buffer.length);
		const dataView = new DataView(buffer);
		const length = this.buffer.length;

		for(let i = 0; i < length; i++)
			dataView.setUint8(i, this.buffer[i]);
		
		return buffer;
	}

	toDataUrl(): string
	{
		const buffer = this.toArrayBuffer();
		const bytes = new Uint8Array(buffer);
		const length = bytes.byteLength;

		let binary = "";

		for(let i = 0; i < length; i++)
			binary += String.fromCharCode(bytes[i]);
		
		const b64 = btoa(binary);

		return `data:audio/midi;base64,${b64}`;
	}

	/**
	 * @deprecated Use toDataUrl
	 */
	toDataURL(): string
	{
		return this.toDataUrl();
	}
}
