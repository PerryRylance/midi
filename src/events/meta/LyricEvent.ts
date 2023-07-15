import { MetaEventType } from "./MetaEvent";
import TextEvent from "./TextEvent";

export default class LyricEvent extends TextEvent
{
	protected getMetaType(): MetaEventType
	{
		return MetaEventType.LYRIC;
	}
}