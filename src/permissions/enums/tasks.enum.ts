/**
 * Permissions to manage tasks.
 */
export enum TasksPermissions {
  Create = 1 << 3,
  Delete = 1 << 2,
  Read = 1 << 0,
  Write = 1 << 1,
}
