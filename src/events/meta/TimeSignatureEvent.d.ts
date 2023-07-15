import MetaEvent, { MetaEventType } from "./MetaEvent";
import ReadStream from "../../streams/ReadStream";
import WriteStream from "../../streams/WriteStream";
export default class TimeSignatureEvent extends MetaEvent {
    private _numerator;
    private _denominator;
    private _ticksPerMetronomeClick;
    private _num32ndNotesPerBeat;
    get numerator(): number;
    set numerator(value: number);
    get denominator(): number;
    set denominator(value: number);
    get ticksPerMetronomeClick(): number;
    set ticksPerMetronomeClick(value: number);
    get num32ndNotesPerBeat(): number;
    set num32ndNotesPerBeat(value: number);
    readBytes(stream: ReadStream): void;
    writeBytes(stream: WriteStream): void;
    protected getMetaType(): MetaEventType;
}
