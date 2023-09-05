/* eslint-disable perfectionist/sort-enums */
/**
 * Permissions-bit to manage the board.
 */
export enum Permissions {
  CreateRole = 1 << 1,
  DeleteRole = 1 << 2,
  UpdateRole = 1 << 3,
  AssignRole = 1 << 4,
  UnassignRole = 1 << 5,
  UpdateProject = 1 << 6,
}

export const ALL_PERMISSIONS = Object.values(Permissions).reduce(
  (a, b) => a | Permissions[b],
  0,
);

export const checkValidPermissions = (permissions: number) => {
  return (permissions & ~ALL_PERMISSIONS) === 0;
};
