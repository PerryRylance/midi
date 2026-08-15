export type CallableArray<T, TOwner = unknown, A extends T[] = T[]> = A & {
    (value: T[] | (() => T[])): TOwner;
};

const backingSetters = new WeakMap<object, (next: unknown[]) => void>();

/**
 * Wraps a plain array (or an Array subclass instance, e.g. TrackCollection) in a Proxy so it
 * remains usable as a normal array (indexing, length, iteration, push/forEach/etc via
 * delegation, instanceof via prototype delegation) but can also be invoked as a function to
 * replace its contents. Calling it returns `owner` (typed, so `instance.items(['a', 'b'])`
 * chains straight into `owner`'s other methods) rather than the array itself.
 */
export function createCallableArray<T, TOwner = unknown, A extends T[] = T[]>(owner: TOwner, initial?: A): CallableArray<T, TOwner, A>
{
    let backing: T[] = initial ?? [];

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
        },

        getPrototypeOf()
        {
            return Reflect.getPrototypeOf(backing);
        },

        setPrototypeOf(_target, proto)
        {
            return Reflect.setPrototypeOf(backing, proto);
        }

    };

    // NB: Target must be an arrow function - it has no "prototype" property, which would
    // otherwise be a non-configurable key on the target with nothing to match it on the
    // backing array, violating the ownKeys/getOwnPropertyDescriptor Proxy invariants.
    const array = new Proxy(() => {}, handler) as unknown as CallableArray<T, TOwner, A>;

    backingSetters.set(array, next => { backing = next as T[]; });

    return array;
}

/**
 * Swaps the backing array/collection of a callable array created by createCallableArray,
 * in place, without recreating the Proxy - so a property can support `instance.prop = x`
 * reference-swap semantics (matching what a plain array field would do) while the callable
 * wrapper itself stays memoized (created once per instance, not once per access).
 */
export function adoptCallableArray<T, TOwner, A extends T[]>(array: CallableArray<T, TOwner, A>, next: A): void
{
    const setter = backingSetters.get(array);

    if(!setter)
        throw new TypeError("Value was not created by createCallableArray");

    setter(next);
}
