expect.extend({
    toEqualValue(received: unknown, expected: unknown)
    {
        // NB: Loose equality here is deliberate - it's what invokes ToPrimitive on `received`
        // (via valueOf/Symbol.toPrimitive) against a primitive `expected`, so this works
        // generically for both numeric (Event.delta, channel, ...) and string (TextEvent.text)
        // callable accessors without needing type-specific comparison logic.
        // eslint-disable-next-line eqeqeq
        const pass = received == expected;

        return {
            pass,
            message: () => `expected ${this.utils.printReceived(received)} to ${pass ? "not " : ""}coerce to ${this.utils.printExpected(expected)}`
        };
    }
});

declare global
{
    namespace jest
    {
        interface Matchers<R>
        {
            /**
             * Like toBe, but compares via loose equality (==) rather than Object.is. Use for
             * values that coerce to a primitive (e.g. callable accessors like Event.delta or
             * TextEvent.text) but aren't themselves that primitive.
             */
            toEqualValue(expected: unknown): R;
        }
    }
}

export {};
