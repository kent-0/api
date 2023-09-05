/**
 * Constructs a type with all properties of `T` set to optional and allows for deep optional properties.
 * Useful for deeply nested objects where properties can be optionally present.
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Retrieves the nested property value of an object using a dot-separated path.
 *
 * @param {DeepPartial<T>} obj - The object from which to retrieve the value.
 * @param {string} path - A dot-separated string representing the path to the nested property.
 * @returns {V | undefined} - Returns the nested property value if found, otherwise undefined.
 * @template T - The type of the object.
 * @template V - The type of the value to retrieve.
 */
export const getNestedPropertyValue = <T, V>(
  obj: DeepPartial<T>,
  path: string,
): V | undefined => {
  const keys = path.split('.');
  let current: any = obj;

  for (const key of keys) {
    if (current[key] === undefined) {
      return undefined;
    }
    current = current[key];
  }

  return current;
};
