import { EndOfTrackEvent, File, NoteOffEvent, NoteOnEvent, Track, WriteStream } from "../src";
import ValidationError from "../src/exceptions/ValidationError";

test("writeBytes passes fix end of track option down to tracks", () => {

    const file = new File().tracks([
        new Track().events([
            new NoteOnEvent,
            new NoteOffEvent(100)
        ])
    ]);

    file.writeBytes(new WriteStream);

    // NB: The auto fixer is expected to mutate the tracks in place
    expect(file.tracks[0].events).toHaveLength(3);
    expect(file.tracks[0].events[2]).toBeInstanceOf(EndOfTrackEvent);

});

test("writeBytes validator throws when no end of track present with auto add end of track off", () => {

    const file = new File().tracks([
        new Track().events([
            new NoteOnEvent,
            new NoteOffEvent(100)
        ])
    ]);

    expect(() => file.writeBytes(new WriteStream, {
        autoEndOfTrackEvents: false
    }))
        .toThrow(ValidationError);

});
