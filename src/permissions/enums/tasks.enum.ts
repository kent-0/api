/**
 * Enum representing bit-based permissions for managing tasks.
 * Each permission is represented by a unique bit in the number.
 * For example, `Create` is represented by the fourth bit being set.
 */
export enum Permissions {
  Create = 2 << 0,
  Delete = 2 << 1,
  Read = 2 << 2,
  Write = 2 << 3,
}

/**
 * Calculate the combined value of all task permissions. This is used to verify if provided permissions are valid.
 * It's the OR combination of all permission values.
 */
export const ALL_PERMISSIONS = Object.values(Permissions).reduce(
  (a, b) => a | Permissions[b],
  0,
);

/**
 * Check if the given task permissions value is valid.
 * A permissions value is considered valid if it only contains bits that are defined in the `Permissions` enum.
 *
 * @param permissions - Bitwise number representing a set of task permissions.
 * @returns Returns true if the permissions are valid, otherwise false.
 */
export const checkValidPermissions = (permissions: number): boolean => {
  return (permissions & ~ALL_PERMISSIONS) === 0;
};
