/* eslint-disable perfectionist/sort-enums */

/**
 * Enum representing bit-based permissions for managing the board.
 * Each permission is represented by a unique bit in the number.
 * For example, `CreateRole` is represented by the second bit being set.
 */
export enum Permissions {
  CreateRole = 1 << 1,
  DeleteRole = 1 << 2,
  UpdateRole = 1 << 3,
  AssignRole = 1 << 4,
  UnassignRole = 1 << 5,
  UpdateProject = 1 << 6,
  AddMember = 1 << 7,
  RemoveMember = 1 << 8,
  UpdateGoal = 1 << 9,
  CreateGoal = 1 << 10,
  RemoveGoal = 1 << 11,
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
