import Track from "./Track";
import Event from "./events/Event";
import EndOfTrackEvent from "./events/meta/EndOfTrackEvent";

type AbsoluteEventWrapper = {
    event: Event;
    absolute: number;
}

type FlattenOptions = {
    preserveEndOfTrackEvents?: boolean;
    appendEndOfTrackEvent?: boolean;
}

export default class TrackCollection extends Array<Track>
{
    /**
     * Flattens an array of two or more tracks into a single track, adjusting delta, stable by track order.
     */
    flatten(options?: FlattenOptions)
    {
        const { preserveEndOfTrackEvents = false, appendEndOfTrackEvent = true } = options ?? {};
        const totalCumulativeDelta = this.map(({ events }) => events.reduce((sum, { delta }) => sum + delta, 0));
        const longestTrackAbsolute = Math.max(...totalCumulativeDelta);
        const wrappers: AbsoluteEventWrapper[] = [];

        if(preserveEndOfTrackEvents && appendEndOfTrackEvent)
            throw new Error("Cannot preserve end of track events and append end of track event, these parameters are mutually exclusive");

        this.forEach(track => {
            let absolute = 0;

            track
                .events
                .forEach(event => {

                    if(!preserveEndOfTrackEvents && event instanceof EndOfTrackEvent)
                        return;

                    absolute += event.delta;

                    wrappers.push({
                        event,
                        absolute
                    });

                });
        });
        
        wrappers.sort((a, b) => a.absolute - b.absolute);

        let absolute = 0;

        const adjusted: Event[] = wrappers.map(wrapper => {

            wrapper.event.delta = wrapper.absolute - absolute;

            absolute = wrapper.absolute;

            return wrapper.event;

        });

        this.length = 0;

        const track = new Track();

        track.events = adjusted;

        if(appendEndOfTrackEvent)
            track.events.push(new EndOfTrackEvent(longestTrackAbsolute - absolute));

        this.push(track);
    }
}
