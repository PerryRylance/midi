export type CallableArray<T> = T[] & {
    (value: T[] | (() => T[])): unknown;
};

/**
 * Wraps a plain array in a Proxy so it remains usable as a normal array (indexing, length,
 * iteration, push/forEach/etc via delegation) but can also be invoked as a function to
 * replace its contents. Calling it returns `owner` rather than the array itself, so the
 * owning instance can be chained, e.g. `instance.items(['a', 'b']).otherMethod()`.
 */
export function createCallableArray<T>(owner: unknown, initial?: T[]): CallableArray<T>
{
    const backing: T[] = initial ? [...initial] : [];

    const handler: ProxyHandler<() => void> = {

        apply(_target, _thisArg, args: unknown[])
        {
            const [value] = args as [T[] | (() => T[])];
            const resolved = typeof value === "function" ? (value as () => T[])() : value;

            backing.length = 0;
            backing.push(...resolved);

            return owner;
        },

        get(_target, prop, receiver)
        {
            const value = Reflect.get(backing, prop, receiver);

            return typeof value === "function" ? value.bind(backing) : value;
        },

        set(_target, prop, value)
        {
            return Reflect.set(backing, prop, value);
        },

        has(_target, prop)
        {
            return Reflect.has(backing, prop);
        },

        deleteProperty(_target, prop)
        {
            return Reflect.deleteProperty(backing, prop);
        },

        ownKeys()
        {
            return Reflect.ownKeys(backing);
        },

        getOwnPropertyDescriptor(_target, prop)
        {
            return Reflect.getOwnPropertyDescriptor(backing, prop);
        }

    };

    // NB: Target must be an arrow function - it has no "prototype" property, which would
    // otherwise be a non-configurable key on the target with nothing to match it on the
    // backing array, violating the ownKeys/getOwnPropertyDescriptor Proxy invariants.
    return new Proxy(() => {}, handler) as unknown as CallableArray<T>;
}
