import { MetaEventType } from "./MetaEvent";
import TextEvent from "./TextEvent";

export default class InstrumentNameEvent extends TextEvent
{
	protected getMetaType(): MetaEventType
	{
		return MetaEventType.INSTRUMENT_NAME;
	}
}