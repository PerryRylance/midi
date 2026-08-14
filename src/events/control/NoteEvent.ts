import ControlEvent from "./ControlEvent";
import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import { StatusBytes } from "../../streams/StatusBytes";

export default abstract class NoteEvent extends ControlEvent
{
	private _key: number = 60;
	private _velocity: number = 127;

	constructor(delta?: number, channel?: number, key: number = 60, velocity: number = 127)
	{
		super(delta, channel);

		this.key = key;
		this.velocity = velocity;
	}

	get key(): number
	{
		return this._key;
	}

	set key(value: number)
	{
		this.assertValidKey(value);

		this._key = value;
	}

	get velocity(): number
	{
		return this._velocity;
	}

	set velocity(value: number)
	{
		this.assertValidVelocityLike(value);

		this._velocity = value;
	}

	readBytes(stream: ReadStream): void 
	{
		this.key = stream.readByte();
		this.velocity = stream.readByte();
	}

	writeBytes(stream: WriteStream, status?: StatusBytes): void
	{
		super.writeBytes(stream, status);

		stream.writeByte(this.key);
		stream.writeByte(this.velocity);
	}
}
