import ReadStream from "../../streams/ReadStream";
import MetaEvent from "../meta/MetaEvent";
export default class MetaEventFactory {
    static fromStream(stream: ReadStream, delta: number): MetaEvent;
}
