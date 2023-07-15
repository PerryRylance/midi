import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";

import { ControlEventType } from "./ControlEvent";
import NoteEvent from "./NoteEvent";

export default class NoteOnEvent extends NoteEvent
{
	protected getTypeHibyte(): number
	{
		return ControlEventType.NOTE_ON;
	}
}