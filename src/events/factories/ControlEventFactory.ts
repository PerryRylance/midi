import ReadStream from "../../streams/ReadStream";
import { StatusBytes } from "../../streams/StatusBytes";
import ControlEvent from "../control/ControlEvent";
import ParseError from "../../exceptions/ParseError";
import NoteOnEvent from "../control/NoteOnEvent";
import NoteOffEvent from "../control/NoteOffEvent";
import AftertouchEvent from "../control/AftertouchEvent";
import ControllerEvent from "../control/ControllerEvent";
import ChannelAftertouchEvent from "../control/ChannelAftertouchEvent";
import ProgramChangeEvent from "../control/ProgramChangeEvent";
import PitchWheelEvent from "../control/PitchWheelEvent";
import ParseControlEventError from "../../exceptions/ParseControlEventError";

enum ControlEventType {
	NOTE_OFF			= 0x80,
	NOTE_ON				= 0x90,
	AFTERTOUCH			= 0xA0,
	CONTROLLER			= 0xB0,
	PROGRAM_CHANGE		= 0xC0,
	CHANNEL_AFTERTOUCH	= 0xD0,
	PITCH_WHEEL			= 0xE0
};

export default class ControlEventFactory
{
	static fromStream(stream: ReadStream, leading: number, delta: number, status: StatusBytes): ControlEvent
	{
		const running = (leading & 0xF0) < 0x80;
		let type: ControlEventType, channel: number;
		let result: ControlEvent;

		if(running)
		{
			type				= status[0];
			channel				= status[1];

			stream.seekRelative(-1);
		}
		else
		{
			status[0] = type	= leading & 0xF0;
			status[1] = channel	= leading & 0x0F;
		}

		switch(type)
		{
			case ControlEventType.NOTE_ON:
				result = new NoteOnEvent(delta, channel);
				break;

			case ControlEventType.NOTE_OFF:
				result = new NoteOffEvent(delta, channel);
				break;

			case ControlEventType.AFTERTOUCH:
				result = new AftertouchEvent(delta, channel);
				break;

			case ControlEventType.CONTROLLER:
				result = new ControllerEvent(delta, channel);
				break;

			case ControlEventType.PITCH_WHEEL:
				result = new PitchWheelEvent(delta, channel);
				break;

			case ControlEventType.PROGRAM_CHANGE:
				result = new ProgramChangeEvent(delta, channel);
				break;

			case ControlEventType.CHANNEL_AFTERTOUCH:
				result = new ChannelAftertouchEvent(delta, channel);
				break;
			
			default:
				throw new ParseControlEventError(stream, "Invalid control event type 0x" + (type as number).toString(16));
		}

		result.readBytes(stream);

		return result;
	}
}