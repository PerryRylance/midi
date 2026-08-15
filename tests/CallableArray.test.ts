import { createCallableArray, CallableArray } from "../src/CallableArray";

class CallableArrayTestHost
{
    readonly items: CallableArray<string>;

    constructor()
    {
        this.items = createCallableArray<string>(this);
    }
}

test("Callable array items can be set and read back with array brackets", () => {

    const host = new CallableArrayTestHost();

    host.items[0] = "test";

    expect(host.items[0]).toBe("test");

});

test("Calling the callable array sets its contents, and readback confirms it", () => {

    const host = new CallableArrayTestHost();

    host.items(["cool", "test"]);

    expect(host.items[0]).toBe("cool");
    expect(host.items[1]).toBe("test");
    expect(host.items.length).toBe(2);

});

test("Calling the callable array returns the owner instance for chaining", () => {

    const host = new CallableArrayTestHost();

    expect(host.items(["etc"])).toBe(host);

});

test("Calling the callable array with a function writes the function's return value", () => {

    const host = new CallableArrayTestHost();

    host.items(() => ["my", "cool", "test"]);

    expect(Array.from(host.items)).toEqual(["my", "cool", "test"]);

});
