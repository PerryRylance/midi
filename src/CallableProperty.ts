export type CallableProperty<T, TOwner = unknown> = {
    (value: T): TOwner;
    (): T;
};

/**
 * Defines a callable property on `prototype` (call once per class, not per instance).
 * The callable itself is a single function shared by every instance via the prototype
 * chain - the only per-instance cost is a WeakMap entry, created lazily the first time
 * the property is read or written, so this scales to large instance counts without
 * allocating a Proxy (or anything else) per instance.
 */
export function defineCallableProperty<T, TOwner extends object>(prototype: TOwner, key: PropertyKey, initial?: T): void
{
    const store = new WeakMap<TOwner, T>();

    Object.defineProperty(prototype, key, {
        value: function(this: TOwner, ...args: [] | [T]): T | TOwner
        {
            if(args.length === 0)
                return store.has(this) ? store.get(this) as T : initial as T;

            store.set(this, args[0]);

            return this;
        },
        enumerable: false,
        configurable: false,
        writable: false
    });
}

// NB: Intersecting with T (rather than just exposing a call signature) means TS treats this
// as assignable to T itself, so e.g. a CallableAccessor<number, TOwner> can be used directly
// in arithmetic (`sum + event.delta`) without an explicit valueOf()/unwrap at every call site.
// The intersection is a type-level convenience only - see the unsafe cast below - real
// coercion at runtime still relies on valueOf/Symbol.toPrimitive, same as CallableArray
// relies on Proxy trapping to actually behave like T[] at runtime.
export type CallableAccessor<T, TOwner> = T & {
    (value: T): TOwner;
    (): T;
    valueOf(): T;
    [Symbol.toPrimitive](hint: string): T;
};

/**
 * Wraps an existing get/set pair in a callable+coercible accessor: calling it with an
 * argument sets the value via `set` and returns `owner` for chaining, calling it with no
 * arguments (or coercing it, e.g. in arithmetic) reads the value via `get`. Intended to be
 * memoized per instance by the caller (one per instance, not one per access), so an
 * existing accessor can grow a callable form without a Proxy and without giving up its
 * plain get/set for compatibility.
 */
export function createCallableAccessor<T, TOwner>(owner: TOwner, get: () => T, set: (value: T) => void): CallableAccessor<T, TOwner>
{
    const callable = ((...args: [] | [T]) => {

        if(args.length === 0)
            return get();

        set(args[0]);

        return owner;

    }) as unknown as CallableAccessor<T, TOwner>;

    callable.valueOf = get;
    callable[Symbol.toPrimitive] = get;

    return callable;
}
