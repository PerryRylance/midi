import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";

import MetaEvent, { MetaEventType } from "./MetaEvent";
import { CallableAccessor, createCallableAccessor } from "../../CallableProperty";

export default class PortPrefixEvent extends MetaEvent
{
	private _port: number = 0;
	private _portAccessor?: CallableAccessor<number, this>;

	readBytes(stream: ReadStream): void
	{
		this.assertByteLength(stream, stream.readByte(), 1);

		this.port = stream.readByte();
	}

	get port(): CallableAccessor<number, this>
	{
		return this._portAccessor ??= createCallableAccessor(this, () => this._port, value => { this.port = value; });
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