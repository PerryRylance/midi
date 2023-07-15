import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
import MetaEvent, { MetaEventType } from "./MetaEvent";
export default class TextEvent extends MetaEvent {
    private _text;
    get text(): string;
    set text(value: string);
    readBytes(stream: ReadStream): void;
    writeBytes(stream: WriteStream): void;
    protected getMetaType(): MetaEventType;
    private assertValidText;
}
