/* eslint-disable perfectionist/sort-enums */
/**
 * Permissions-bit to manage the board.
 */
export enum Permissions {
  CreateRole = 1 << 0,
  DeleteRole = 1 << 1,
  UpdateRole = 1 << 2,
  AssignRole = 1 << 3,
  UnassignRole = 1 << 4,
  UpdateProject = 1 << 5,
}

export const ALL_PERMISSIONS = Object.values(Permissions).reduce(
  (a, b) => a | Permissions[b],
  0,
);

export const checkValidPermissions = (permissions: number) => {
  return (permissions & ~ALL_PERMISSIONS) === 0;
};
