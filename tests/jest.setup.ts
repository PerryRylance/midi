expect.extend({
    toEqualValue(received: unknown, expected: unknown)
    {
        const pass = Object.is(Number(received), Number(expected));

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
             * Like toBe, but compares via Number(received) === Number(expected) rather
             * than Object.is. Use for values that coerce to a number (e.g. callable
             * accessors like Event.delta) but aren't themselves a number instance.
             */
            toEqualValue(expected: unknown): R;
        }
    }
}

export {};
