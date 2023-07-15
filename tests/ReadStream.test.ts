import ReadStream from "../src/streams/ReadStream";
import File from "../src/File";

const getBufferFromValue = value => {

	let bytes;

	if(value <= 0xFF)
		bytes = 1;
	else if(value <= 0xFFFF)
		bytes = 2;
	else if(value <= 0xFFFFFFFF)
		bytes = 4;
	
	const bits = bytes * 8;
	const func = `setUint${bits}`;

	const buffer = new ArrayBuffer(bytes);
	const view = new DataView(buffer);

	view[func](0, value);

	return buffer;

};

test("Reads byte", () => {

	const byte = 0x7F;
	const buffer = getBufferFromValue(byte);
	const stream = new ReadStream(buffer);

	const readback = stream.readByte();

	expect(readback).toBe(byte);

});

test("Reads short", () => {

	const short = 0x7FFF;
	const buffer = getBufferFromValue(short);
	const stream = new ReadStream(buffer);

	const readback = stream.readShort();

	expect(readback).toBe(short);

});

test("Reads uint", () => {

	const uint = 0xFEEDBEEF;
	const buffer = getBufferFromValue(uint);
	const stream = new ReadStream(buffer);

	const readback = stream.readUint();

	expect(readback).toBe(uint);

});

test("Reads VLV", () => {

	const buffer = new ArrayBuffer(3);
	const view = new DataView(buffer);

	view.setUint8(0, 0x82);
	view.setUint8(1, 0x80);
	view.setUint8(2, 0x00);

	const stream = new ReadStream(buffer);
	const readback = stream.readVLV();

	expect(readback).toBe(32768);

});