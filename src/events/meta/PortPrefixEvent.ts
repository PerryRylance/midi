import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";

import MetaEvent, { MetaEventType } from "./MetaEvent";

export default class PortPrefixEvent extends MetaEvent
{
	private _port: number = 0;

	readBytes(stream: ReadStream): void
	{
		this.assertByteLength(stream, stream.readByte(), 1);

		this.port = stream.readByte();
	}

	get port(): number
	{
		return this._port;
	}

	set port(value: number)
	{
		this.assertValidByte(value);

		this._port = value;
	}

	writeBytes(stream: WriteStream): void
	{
		super.writeBytes(stream);

		stream.writeByte(1);

		stream.writeByte(this.port);
	}

	protected getMetaType(): MetaEventType
	{
		return MetaEventType.PORT_PREFIX;
	}
}