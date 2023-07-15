import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";

import MetaEvent, { MetaEventType } from "./MetaEvent";

export default class EndOfTrackEvent extends MetaEvent
{
	readBytes(stream: ReadStream): void
	{
		this.assertByteLength(stream, stream.readByte(), 0);
	}

	writeBytes(stream: WriteStream): void
	{
		super.writeBytes(stream);

		stream.writeByte(0);
	}

	protected getMetaType(): MetaEventType
	{
		return MetaEventType.END_OF_TRACK;
	}
}