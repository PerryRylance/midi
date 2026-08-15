import { File, MetaEvent, NoteOffEvent, NoteOnEvent, Track, TrackNameEvent } from "../src";

test("Adds tracks fluently", () => {

    const file = new File()
        .tracks([
            new Track(),
            new Track(),
            new Track()
        ]);
    
    expect(file.tracks.length).toEqualValue(3);

});

test("Adds tracks fluently with callback", () => {

    const file = new File()
        .tracks(() => [
            new Track(),
            new Track(),
            new Track()
        ]);
    
    expect(file.tracks).toHaveLength(3);

});

test("Adds events fluently", () => {

    const file = new File()
        .tracks([
            new Track().events([
                new TrackNameEvent().text("My cool track"),
                new NoteOnEvent().key(60),
                new NoteOffEvent().delta(960).key(60)
            ])
        ]);

    const track = file.tracks[0];

    expect(track.events).toHaveLength(3);
    expect(track.events[0]).toBeInstanceOf(TrackNameEvent);
    expect((track.events[0] as TrackNameEvent).text).toEqualValue("My cool track");

    const noteOn = track.events[1] as NoteOnEvent;

    expect(noteOn.key).toEqualValue(60);
    expect(noteOn.velocity).toEqualValue(127);
    expect(noteOn.delta).toEqualValue(0);

    const noteOff = track.events[2] as NoteOffEvent;

    expect(noteOff.key).toEqualValue(60);
    expect(noteOff.delta).toEqualValue(960);

});
