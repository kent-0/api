/**
 * Permissions-bit to manage the board.
 */
export enum Permissions {
  UpdateProject = 1 << 0,
}

export const ALL_PERMISSIONS = Object.values(Permissions).reduce(
  (a, b) => a | Permissions[b],
  0,
);

export const checkValidPermissions = (permissions: number) => {
  return (permissions & ~ALL_PERMISSIONS) === 0;
};
