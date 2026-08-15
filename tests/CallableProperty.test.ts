import { CallableProperty, defineCallableProperty } from "../src/CallableProperty";

class CallablePropertyTestHost
{
    declare readonly prop: CallableProperty<number, CallablePropertyTestHost>;
    declare readonly chain: CallableProperty<number, CallablePropertyTestHost>;
}

defineCallableProperty(CallablePropertyTestHost.prototype, "prop");
defineCallableProperty(CallablePropertyTestHost.prototype, "chain");

test("Calling a callable property sets its value, readable back by calling with no arguments", () => {

    const host = new CallablePropertyTestHost();

    host.prop(123);

    expect(host.prop()).toBe(123);

});

test("Calling a callable property returns the owner instance for chaining", () => {

    const host = new CallablePropertyTestHost();

    expect(host.prop(123)).toBe(host);

});

test("Chained calls set every property involved", () => {

    const host = new CallablePropertyTestHost();

    host.prop(123).chain(234);

    expect(host.prop()).toBe(123);
    expect(host.chain()).toBe(234);

});

test("Separate instances do not share callable property state", () => {

    const a = new CallablePropertyTestHost();
    const b = new CallablePropertyTestHost();

    a.prop(123);
    b.prop(456);

    expect(a.prop()).toBe(123);
    expect(b.prop()).toBe(456);

});
