/**
 * Permissions-bit to manage tasks.
 */
export enum Permissions {
  Create = 2 << 3,
  Delete = 2 << 2,
  Read = 2 << 0,
  Write = 2 << 1,
}

export const ALL_PERMISSIONS = Object.values(Permissions).reduce(
  (a, b) => a | Permissions[b],
  0,
);

export const checkValidPermissions = (permissions: number) => {
  return (permissions & ~ALL_PERMISSIONS) === 0;
};
