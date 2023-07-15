import ReadStream from "../../streams/ReadStream";
import MetaEvent, { MetaEventType } from "../meta/MetaEvent";
import TextEvent from "../meta/TextEvent";
import SetTempoEvent from "../meta/SetTempoEvent";
import SmtpeOffsetEvent from "../meta/SmtpeOffsetEvent";
import SequenceNumberEvent from "../meta/SequenceNumberEvent";
import EndOfTrackEvent from "../meta/EndOfTrackEvent";
import ChannelPrefixEvent from "../meta/ChannelPrefixEvent";
import PortPrefixEvent from "../meta/PortPrefixEvent";
import SequencerSpecificEvent from "../meta/SequencerSpecificEvent";
import CopyrightEvent from "../meta/CopyrightEvent";
import TrackNameEvent from "../meta/TrackNameEvent";
import InstrumentNameEvent from "../meta/InstrumentNameEvent";
import LyricEvent from "../meta/LyricEvent";
import MarkerEvent from "../meta/MarkerEvent";
import CuePointEvent from "../meta/CuePointEvent";
import ParseError from "../../exceptions/ParseError";
import TimeSignatureEvent from "../meta/TimeSignatureEvent";
import KeySignatureEvent from "../meta/KeySignatureEvent";

export default class MetaEventFactory
{
	static fromStream(stream: ReadStream, delta: number): MetaEvent
	{
		const type: MetaEventType = stream.readByte();
		let result: MetaEvent;

		switch(type)
		{
			case MetaEventType.SEQUENCE_NUMBER:
				result = new SequenceNumberEvent(delta);
				break;

			case MetaEventType.TEXT:
				result = new TextEvent(delta);
				break;

			case MetaEventType.COPYRIGHT:
				result = new CopyrightEvent(delta);
				break;

			case MetaEventType.TRACK_NAME:
				result = new TrackNameEvent(delta);
				break;

			case MetaEventType.INSTRUMENT_NAME:
				result = new InstrumentNameEvent(delta);
				break;

			case MetaEventType.LYRIC:
				result = new LyricEvent(delta);
				break;

			case MetaEventType.MARKER:
				result = new MarkerEvent(delta);
				break;

			case MetaEventType.CUE_POINT:
				result = new CuePointEvent(delta);
				break;
			
			case MetaEventType.CHANNEL_PREFIX:
				result = new ChannelPrefixEvent(delta);
				break;
		
			case MetaEventType.PORT_PREFIX:
				result = new PortPrefixEvent(delta);
				break;
			
			case MetaEventType.END_OF_TRACK:
				result = new EndOfTrackEvent(delta);
				break;

			case MetaEventType.SET_TEMPO:
				result = new SetTempoEvent(delta);
				break;
			
			case MetaEventType.SMPTE_OFFSET:
				result = new SmtpeOffsetEvent(delta);
				break;
			
			case MetaEventType.TIME_SIGNATURE:
				result = new TimeSignatureEvent(delta);
				break;
			
			case MetaEventType.KEY_SIGNATURE:
				result = new KeySignatureEvent(delta);
				break;
			
			case MetaEventType.SEQUENCER_SPECIFIC:
				result = new SequencerSpecificEvent(delta);
				break;

			default:
				throw new ParseError(stream, "Invalid meta event type 0x" + (type as number).toString(16));
		}

		result.readBytes(stream);

		return result;
	}
}