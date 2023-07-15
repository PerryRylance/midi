import { MetaEventType } from "./MetaEvent";
import TextEvent from "./TextEvent";

export default class CuePointEvent extends TextEvent
{
	protected getMetaType(): MetaEventType
	{
		return MetaEventType.CUE_POINT;
	}
}