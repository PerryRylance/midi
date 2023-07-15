import { MetaEventType } from "./MetaEvent";
import TextEvent from "./TextEvent";

export default class TrackNameEvent extends TextEvent
{
	protected getMetaType(): MetaEventType
	{
		return MetaEventType.TRACK_NAME;
	}
}