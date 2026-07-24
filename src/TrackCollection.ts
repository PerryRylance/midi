import Track from "./Track";
import Event from "./events/Event";

type AbsoluteEventWrapper = {
    event: Event;
    absolute: number;
}

export default class TrackCollection extends Array<Track>
{
    /**
     * Flattens an array of two or more tracks into a single track, adjusting delta, stable by track order.
     */
    flatten()
    {
        const events: AbsoluteEventWrapper[] = [];

        this.forEach(track => {
            let absolute = 0;

            track.events.forEach(event => {

                absolute += event.delta;

                events.push({
                    event,
                    absolute
                });

            });
        });
        
        events.sort((a, b) => a.absolute - b.absolute);

        let absolute = 0;

        const adjusted: Event[] = events.map(wrapper => {

            wrapper.event.delta = wrapper.absolute - absolute;

            absolute = wrapper.absolute;

            return wrapper.event;

        });

        this.length = 0;

        const track = new Track();

        track.events = adjusted;

        this.push(track);
    }
}
