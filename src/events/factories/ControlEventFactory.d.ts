import ReadStream from "../../streams/ReadStream";
import { StatusBytes } from "../../streams/StatusBytes";
import ControlEvent from "../control/ControlEvent";
export default class ControlEventFactory {
    static fromStream(stream: ReadStream, leading: number, delta: number, status: StatusBytes): ControlEvent;
}
