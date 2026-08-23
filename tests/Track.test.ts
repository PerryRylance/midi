import { EndOfTrackEvent, NoteOffEvent, NoteOnEvent, Track } from "../src";

test("Fix end of track appends missing end of track event", () => {

    const track = new Track()
        .events([
            new NoteOnEvent(),
            new NoteOffEvent(100)
        ])
        .fixEndOfTrack();
    
    expect(track.events).toHaveLength(3);
    expect(track.events[2]).toBeInstanceOf(EndOfTrackEvent);

});

test("Fix end of track removes leading end of track events", () => {

    const track = new Track()
        .events([
            new NoteOnEvent(),
            new EndOfTrackEvent(),
            new NoteOffEvent(100)
        ])
        .fixEndOfTrack();
    
    expect(track.events).toHaveLength(3);
    expect(track.events[1]).toBeInstanceOf(NoteOffEvent);
    expect(track.events[2]).toBeInstanceOf(EndOfTrackEvent);

});

test("Fix end of track preserves delta of existing end of track event", () => {

    const track = new Track()
        .events([
            new NoteOnEvent(),
            new NoteOffEvent(100),
            new EndOfTrackEvent(100)
        ])
        .fixEndOfTrack();
    
    expect(track.events).toHaveLength(3);
    expect(track.events[2]).toBeInstanceOf(EndOfTrackEvent);
    expect(track.events[2].delta).toEqualValue(100);

});

test("Fix end of track adds accumulated interior end of track events to preceeding event", () => {

    const track = new Track()
        .events([
            new NoteOnEvent(),
            new EndOfTrackEvent(50),
            new EndOfTrackEvent(100),
            new NoteOffEvent(100),
        ])
        .fixEndOfTrack();
    
    expect(track.events).toHaveLength(3);
    expect(track.events[1]).toBeInstanceOf(NoteOffEvent);
    expect(track.events[1].delta).toEqualValue(250);

});
