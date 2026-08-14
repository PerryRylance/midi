import { ControllerEvent, PitchWheelEvent } from "../src";
import { NamedControllerType } from "../src/events/control/ControllerEvent";
import PitchBendRangeEventsFactory from "../src/events/factories/PitchBendRangeEventsFactory";

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

test("Bend range factory produces expected head", () => {

    const events = PitchBendRangeEventsFactory.create(0, 24);

    expect(events[0]).toBeInstanceOf(ControllerEvent);
    expect(events[0].controller).toBe(NamedControllerType.REGISTERED_PARAMETER_FINE);
    expect(events[0].value).toBe(0);

    expect(events[1]).toBeInstanceOf(ControllerEvent);
    expect(events[1].controller).toBe(NamedControllerType.REGISTERED_PARAMETER_COARSE);
    expect(events[1].value).toBe(0);

});

test("Bend range factory produces expected tail", () => {

    const events = PitchBendRangeEventsFactory.create(0, 24);

    expect(events[3]).toBeInstanceOf(ControllerEvent);
    expect(events[3].controller).toBe(NamedControllerType.REGISTERED_PARAMETER_FINE);
    expect(events[3].value).toBe(0x7F);

    expect(events[4]).toBeInstanceOf(ControllerEvent);
    expect(events[4].controller).toBe(NamedControllerType.REGISTERED_PARAMETER_COARSE);
    expect(events[4].value).toBe(0x7F);

});

test("Bend range factory produces expected coarse data entry with only semitones", () => {

    const events = PitchBendRangeEventsFactory.create(0, 24);

    expect(events).toHaveLength(5);

    const data = events[2];

    expect(data).toBeInstanceOf(ControllerEvent);
    expect(data.controller).toBe(NamedControllerType.DATA_ENTRY_COARSE);
    expect(data.value).toBe(24);

});

test("Bend range factory produces expected fine data entry with cents", () => {

    const events = PitchBendRangeEventsFactory.create(0, 2, 50);

    expect(events).toHaveLength(6);

    const coarse = events[2];
    const fine = events[3];

    expect(coarse).toBeInstanceOf(ControllerEvent);
    expect(coarse.controller).toBe(NamedControllerType.DATA_ENTRY_COARSE);
    expect(coarse.value).toBe(2);

    expect(fine).toBeInstanceOf(ControllerEvent);
    expect(fine.controller).toBe(NamedControllerType.DATA_ENTRY_FINE);
    expect(fine.value).toBe(50);

});
