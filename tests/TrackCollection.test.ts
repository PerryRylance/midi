import { NoteOnEvent, Track, Event, NoteOffEvent, ControllerEvent, File, EndOfTrackEvent } from "../src";
import TrackCollection from "../src/TrackCollection";

const getMultitrackCollection = () => {

    const collection = new TrackCollection();

    const first = new Track();
    const second = new Track();

    collection.push(first, second);

    first.events.push(new NoteOnEvent);
    first.events.push(new NoteOffEvent(400));

    second.events.push(new ControllerEvent(50));

    return collection;

};

test("Flattens events in correct order", () => {

    const collection = getMultitrackCollection();

    collection.flatten({ appendEndOfTrackEvent: false });

    expect(collection.length).toBe(1);

    const events = collection[0].events;

    expect(events.length).toBe(3);

    expect(events[0]).toBeInstanceOf(NoteOnEvent);
    expect(events[1]).toBeInstanceOf(ControllerEvent);
    expect(events[2]).toBeInstanceOf(NoteOffEvent);

});

test("Flatten adjusts delta", () => {

    const collection = getMultitrackCollection();

    collection.flatten();

    const events = collection[0].events;

    expect(events[0].delta).toBe(0);
    expect(events[1].delta).toBe(50);
    expect(events[2].delta).toBe(350);

});

test("Flatten is stable", () => {

    const collection = getMultitrackCollection();

    collection[0].events[1].delta = 50;

    collection.flatten();

    const events = collection[0].events;

    expect(events[0]).toBeInstanceOf(NoteOnEvent);
    expect(events[1]).toBeInstanceOf(NoteOffEvent);
    expect(events[2]).toBeInstanceOf(ControllerEvent);

    expect(events[0].delta).toBe(0);
    expect(events[1].delta).toBe(50);
    expect(events[2].delta).toBe(0);

});

test("Flatten strips EndOfTrackEvent events except last", () => {

    const collection = getMultitrackCollection();

    collection[0].events.push(new EndOfTrackEvent);
    collection[1].events.push(new EndOfTrackEvent);

    collection.flatten();

    const events = collection[0].events;

    expect(events.filter(event => event instanceof EndOfTrackEvent)).toHaveLength(1);
    expect(events.at(-1)).toBeInstanceOf(EndOfTrackEvent);

});

test("Flatten keeps latest temporal EndOfTrackEvent", () => {

    const collection = getMultitrackCollection();

    collection[0].events.push(new EndOfTrackEvent(600));
    collection[1].events.push(new EndOfTrackEvent);

    collection.flatten();

    const events = collection[0].events;
    const totalCumulativeDelta = events.reduce((sum, { delta }) => sum + delta, 0);

    expect(events.at(-1)).toBeInstanceOf(EndOfTrackEvent);
    expect(totalCumulativeDelta).toBe(1000);

});

test("File tracks is TrackCollection", () => {

    const file = new File();

    expect(file.tracks).toBeInstanceOf(TrackCollection);

});

test("File can mutate event array to TrackCollection", () => {

    const file = new File();
    const legacy: Track[] = [new Track];

    file.tracks = legacy;

    expect(file.tracks).toBeInstanceOf(TrackCollection);
    expect(file.tracks).toHaveLength(1);

});
