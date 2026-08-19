import { ControllerEvent, ControllerType } from "../src";

test("Can assign undefined CC types", () => {

    const event = new ControllerEvent();
    
    event.controller = 0x59;

    expect(event.controller).toEqualValue(0x59);

});

test("Cannot assign out of range CC type", () => {

    const event = new ControllerEvent();

    // @ts-expect-error 0x80 is out of range for ControllerType
    event.controller = 0x80;

});

test("Cannot assign out of range CC value", () => {

    expect(() => new ControllerEvent().value = 0x80).toThrow(RangeError);

});

test("Can assign type via contructor", () => {

    expect(new ControllerEvent(0, 0, ControllerType.HOLD_PEDAL_1).controller).toEqualValue(ControllerType.HOLD_PEDAL_1);

});

test("Can assign value via constructor", () => {

    expect(new ControllerEvent(0, 0, ControllerType.BANK_SELECT_COARSE, 123).value).toEqualValue(123);

});
