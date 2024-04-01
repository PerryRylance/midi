import WriteStream from "../src/streams/WriteStream";
import NoteOnEvent from "../src/events/control/NoteOnEvent";
import ByteArrays from "./EventByteArrays";

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

	switch(bytes)
	{
		case 1:
			return view.getUint8(0);

		case 2:
			return view.getUint16(0);

		case 4:
			return view.getUint32(0);
	}

	throw new Error("Unexpected state");

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

test("Writes event without delta", () => {

	const event = new NoteOnEvent();

	event.channel = 2;
	event.key = 61;
	event.velocity = 120;

	const stream = new WriteStream();
	
	event.writeBytes(stream, undefined, {omitDelta: true});

	const buffer = Array.from(new Uint8Array(stream.toArrayBuffer()));

	expect(buffer).toStrictEqual(ByteArrays.NOTE_ON.slice(1, 4));

});