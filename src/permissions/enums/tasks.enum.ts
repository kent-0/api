/**
 * Permissions to manage tasks.
 */
export enum TasksPermissions {
  Create = 2 << 3,
  Delete = 2 << 2,
  Read = 2 << 0,
  Write = 2 << 1,
}
