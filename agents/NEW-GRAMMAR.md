# New grammar
This library is great, but kind of unwieldy for generating MIDI in memory.

The lead developer is proposing a few things to improve that.

## Foreword
Without wanting to influence the implementation here, we are going to be dealing with a potentially very large number of MIDI events when we do the full implementation here. So it's really really important that the following instructions are carried out in such a way that when applied to thousands, or even tens of thousands of objects, that we keep the memory footprint as low as possible.

## Callable arrays
One of the supporting things we need here is a callable array. We need this for compatibility reasons - many things that are currently arrays must continue to function as such. But we need to be able to call them to invoke new functionality.

For this please first start with a test. In our test we need to make a class, we'll use this to try out our callable array mechanism. The class must have `items` on it, a readonly callable array.

You must test that items can be set and retrieved with array brackets, for example `instance.items[0] = "test";` then readback.

You must test that the array can be called, for example `instance.items(['cool', 'test'])` should set the contents of the array, then test readback.

`instance.items(['etc'])` must return `instance` for chaining.

It is not a requirement but it would also be helpful if the callable array could call functions when passed in, for example `instance.items(() => ['my', 'cool', 'test'])` should write those items to the array.

Please report your findings after implementing this.

## Callable properties
Another thing we need is to be able to call properties, for chaining purposes.

For example, `instance.prop(123)` should then pass `expect(instance.prop).toBe(123)`.

It is also a requirement that these callable properties return the `instance`. So we need a test that `instance.prop(123).chain(234)` sets both `prop` and `chain` on the instance. These must be explicitly declared, not dynamic, just to be perfectly clear.

It is not a requirement but ideally calling `instance.prop()` should return the value, jQuery style. This is optional though if not achievable.

Please report your findings after implementing this.

## Chaining
Once the developer has signed off on the callables above we need to start applying it to this library, starting with `Event`.

You'll see that `Event` has `delta` getters and setters. The requirement is that this should still be usable for compatibility reasons, but also that `expect(event.delta(321)).toBe(event)`, also checking that the delta was set to 321.

Start with that and once passing, check back in with the lead developer.
