import { MetaEventType } from "./MetaEvent";
import TextEvent from "./TextEvent";

export default class MarkerEvent extends TextEvent
{
	protected getMetaType(): MetaEventType
	{
		return MetaEventType.MARKER;
	}
}