/* eslint-disable perfectionist/sort-enums */

/**
 * Enum representing bit-based permissions for managing the board.
 * Each permission is represented by a unique bit in the number.
 * For example, `CreateRole` is represented by the second bit being set.
 */
export enum Permissions {
  RoleCreate = 1 << 1,
  RoleDelete = 1 << 2,
  RoleUpdate = 1 << 3,
  RoleAssign = 1 << 4,
  RoleUnassign = 1 << 5,
  ProjectUpdate = 1 << 6,
  MemberAdd = 1 << 7,
  MemberRemove = 1 << 8,
  GoalUpdate = 1 << 9,
  GoalCreate = 1 << 10,
  GoalRemove = 1 << 11,
}

/**
 * Calculate the combined value of all permissions. This is used to verify if provided permissions are valid.
 * It's the OR combination of all permission values.
 */
export const ALL_PERMISSIONS = Object.values(Permissions).reduce(
  (a, b) => a | Permissions[b],
  0,
);

/**
 * Check if the given permissions value is valid.
 * A permissions value is considered valid if it only contains bits that are defined in the `Permissions` enum.
 *
 * @param permissions - Bitwise number representing a set of permissions.
 * @returns Returns true if the permissions are valid, otherwise false.
 */
export const checkValidPermissions = (permissions: number): boolean => {
  return (permissions & ~ALL_PERMISSIONS) === 0;
};
