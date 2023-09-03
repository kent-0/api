/**
 * Permissions-bit to manage the board.
 */
export enum BasePermissions {
  AddMembers = 1 << 2,
  AddRoles = 1 << 4,
  AssignRoles = 1 << 6,
  ChangeIcon = 1 << 0,
  ChangeName = 1 << 1,
  RemoveMembers = 1 << 3,
  RemoveRoles = 1 << 5,
}
