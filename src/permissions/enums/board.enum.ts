/* eslint-disable perfectionist/sort-enums */

/**
 * Enum representing bit-based permissions for managing the board.
 * Each permission is represented by a unique bit in the number.
 * For example, `CreateRole` is represented by the second bit being set.
 */
export enum BoardPermissionsEnum {
  BoardUpdate = 2 << 1,
  RoleCreate = 2 << 2,
  RoleDelete = 2 << 3,
  RoleUpdate = 2 << 4,
  RoleAssign = 2 << 5,
  RoleUnassign = 2 << 6,
  MemberAdd = 2 << 7,
  MemberRemove = 2 << 8,
  StepCreate = 2 << 9,
  StepRemove = 2 << 10,
  StepUpdate = 2 << 11,
  TaskCreate = 2 << 12,
  TaskRemove = 2 << 13,
  TaskUpdate = 2 << 14,
  TaskAssign = 2 << 15,
  TaskUnassign = 2 << 16,
  TaskMove = 2 << 17,
  TaskCommentCreate = 2 << 18,
  TaskCommentRemove = 2 << 19,
  TaskCommentUpdate = 2 << 20,
  TaskCommentPin = 2 << 21,
  TaskCommentUnpin = 2 << 22,
  TaskView = 2 << 23,
}

/**
 * Calculates the combined value of all permissions defined in the `Permissions` enum.
 * This is achieved by iterating over the keys of the enum and performing a bitwise OR operation
 * on each permission value. The result represents a value where all permission bits are set.
 *
 * @returns A number representing the combined value of all permissions.
 */
export const ALL_PERMISSIONS = Object.keys(BoardPermissionsEnum).reduce(
  (acc, val) => acc | BoardPermissionsEnum[val],
  0,
);

/**
 * Check if the given permissions value is valid.
 * A permissions value is considered valid if it only contains bits that are defined in the `Permissions` enum
 * and at least one valid bit is set.
 *
 * @param permissions - Bitwise number representing a set of permissions.
 * @returns Returns true if the permissions are valid, otherwise false.
 */
export const checkValidPermissions = (permissions: number): boolean => {
  // Check that no undefined bits are set
  const noUndefinedBits = (permissions & ~ALL_PERMISSIONS) === 0;
  // Check that at least one valid bit is set
  const atLeastOneValidBit = (permissions & ALL_PERMISSIONS) !== 0;
  return noUndefinedBits && atLeastOneValidBit;
};
