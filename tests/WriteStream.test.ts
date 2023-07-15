import WriteStream from "../src/streams/WriteStream";

const getValueFromBuffer = (buffer: ArrayBuffer, bytes: number) => {

	switch(bytes)
	{
		case 1:
		case 2:
		case 4:
			break;
		
		default:
			throw new Error("Invalid byte size");
	}

	const bits = bytes * 8;
	const view = new DataView(buffer);

	return view[`getUint${bits}`](0);

};

test("Writes byte", () => {

	const byte = 0x7F;
	const stream = new WriteStream();

	stream.writeByte(byte);

	const buffer = stream.toArrayBuffer();
	const readback = getValueFromBuffer(buffer, 1);

	expect(readback).toBe(byte);

});

test("Writes short", () => {

	const short = 0x7FFF;
	const stream = new WriteStream();

	stream.writeShort(short);

	const buffer = stream.toArrayBuffer();
	const readback = getValueFromBuffer(buffer, 2);

	expect(readback).toBe(short);

});

test("Writes uint", () => {

	const uint = 0xFEEDBEEF;
	const stream = new WriteStream();

	stream.writeUint(uint);

	const buffer = stream.toArrayBuffer();
	const readback = getValueFromBuffer(buffer, 4);

	expect(readback).toBe(uint);

});

test("Writes VLV", () => {

	const stream = new WriteStream();
	stream.writeVLV(32768);

	const buffer = stream.toArrayBuffer();
	const view = new DataView(buffer);

	let readback = 0;

	for(let i = 0; i < 3; i++)
		readback = (readback << 8) | view.getUint8(i);
	
	expect(readback).toBe(0x828000);
	
});

test("Writes Data URL", () => {

	const stream = new WriteStream();
	stream.writeUint(0xFEEDBEEF);

	const dataUrl = stream.toDataURL();

	expect(dataUrl).toBe("data:audio/midi;base64,/u2+7w==");

});