import { PitchWheelEvent } from "../src";

test("Can set wheel amount in constructor", () => {

    const expected = 0.5;
    const event = new PitchWheelEvent(0, 0, expected);
    const actual = event.amount;
    const delta = 0.00004;

    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(delta);

});

test("Cannot set invalid wheel amount in constructor", () => {

    expect(() => new PitchWheelEvent(0, 0, 999)).toThrow(RangeError);

});
