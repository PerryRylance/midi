import { MetaEventType } from "./MetaEvent";
import TextEvent from "./TextEvent";
export default class CopyrightEvent extends TextEvent {
    protected getMetaType(): MetaEventType;
}
