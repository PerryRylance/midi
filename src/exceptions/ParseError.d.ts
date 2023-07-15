import ReadStream from "../streams/ReadStream";
export default class ParseError extends Error {
    constructor(stream: ReadStream, message: string);
}
