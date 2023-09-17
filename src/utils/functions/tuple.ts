/**
 * A utility function to enforce tuple types.
 * This function accepts a variadic number of string arguments and returns a tuple of those strings.
 * The primary use-case is to ensure that arrays of strings are treated as tuples,
 * preserving the specific order and number of elements.
 *
 * @function tuple
 * @param {...T} args - A variadic number of string arguments.
 * @returns {(typeof args)[number]} - A tuple type of the passed strings.
 *
 * @example
 * const exampleTuple = tuple('a', 'b', 'c'); // Returns a tuple ['a', 'b', 'c']
 */
export const tuple = <T extends string[]>(...args: T): T => args;
