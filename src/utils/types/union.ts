/**
 * `Join` is a generic utility type that takes two type parameters: `K` and `P`.
 * It is designed to concatenate two strings or numbers using a dot ('.') separator.
 * If either of the parameters is not a string or a number, it will resolve to `never`.
 *
 * @type {Join}
 *
 * @template K - The first type parameter that should be either string or number.
 * @template P - The second type parameter that should be either string or number.
 *
 * @example
 * type Test = Join<'a', 'b'>;  // Result: 'a.b'
 * type Test2 = Join<1, 2>;    // Result: '1.2'
 */
export type Join<K, P> = K extends number | string
  ? P extends number | string
    ? `${K}.${P}`
    : never
  : never;
