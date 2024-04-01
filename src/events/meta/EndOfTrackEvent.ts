import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import { EventWriteOptions } from "../Event";

import MetaEvent, { MetaEventType } from "./MetaEvent";

export default class EndOfTrackEvent extends MetaEvent
{
	readBytes(stream: ReadStream): void
	{
		this.assertByteLength(stream, stream.readByte(), 0);
	}

	writeBytes(stream: WriteStream, status?: undefined, options?: EventWriteOptions): void
	{
		super.writeBytes(stream, undefined, options);

		stream.writeByte(0);
	}

	protected getMetaType(): MetaEventType
	{
		return MetaEventType.END_OF_TRACK;
	}
}