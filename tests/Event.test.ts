import { TextEvent } from "../src";

test("delta getter and setter remain usable for compatibility", () => {

    const event = new TextEvent();

    event.delta = 55;

    expect(event.delta).toEqualValue(55);

});

test("Calling delta sets it and returns the event for chaining", () => {

    const event = new TextEvent();

    expect(event.delta(321)).toBe(event);

    expect(event.delta).toEqualValue(321);

});

test("Calling delta with no arguments reads it back", () => {

    const event = new TextEvent();

    event.delta(88);

    expect(event.delta()).toBe(88);

});
