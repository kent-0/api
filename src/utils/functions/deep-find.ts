/**
 * Recursively searches for a key within an object, including its nested objects.
 *
 * @param {T} obj - The object in which to search for the key.
 * @param {string} keyToFind - The key to search for.
 * @returns {V | undefined} - Returns the value associated with the key if found, otherwise undefined.
 * @template V - The type of the value associated with the key.
 * @template T - The type of the object (defaults to any object).
 */
export function deepFindKey<V, T extends object = object>(
  obj: T,
  keyToFind: string,
): V | undefined {
  if (keyToFind in obj) {
    return obj[keyToFind];
  }

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const result = deepFindKey(obj[key] as any, keyToFind);
      if (result !== undefined) {
        return result as V;
      }
    }
  }

  return undefined;
}
