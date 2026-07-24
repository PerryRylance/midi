import { ControllerEvent } from "../src";

test("Can assign undefined CC types", () => {

    const event = new ControllerEvent();
    
    event.controller = 0x59;

    expect(event.controller).toBe(0x59);

});

test("Cannot assign out of range CC type", () => {

    const event = new ControllerEvent();

    // @ts-expect-error 0x80 is out of range for ControllerType
    event.controller = 0x80;

});
