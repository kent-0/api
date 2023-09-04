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
