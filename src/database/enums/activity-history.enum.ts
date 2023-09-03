/**
 * Enum representing the different types of activities in the history.
 */
export enum ActivityHistoryTypes {
  /** Activity type when a task is created. */
  TaskCreation,

  /** Activity type when a task is deleted. */
  TaskDelete,

  /** Activity type when a task is moved. */
  TaskMove,

  /** Activity type when a step is created. */
  StepCreation,

  /** Activity type when a step is deleted. */
  StepDelete,

  /** Activity type when a step is removed. */
  StepRemove,

  /** Activity type when a step is updated. */
  StepUpdate,

  /** Activity type when a goal is created. */
  GoalCreation,

  /** Activity type when a goal is deleted. */
  GoalDelete,

  /** Activity type when a goal is removed. */
  GoalRemove,

  /** Activity type when a goal is updated. */
  GoalUpdate,

  /** Activity type when a note is created. */
  NoteCreation,

  /** Activity type when a note is deleted. */
  NoteDelete,

  /** Activity type when a note is updated. */
  NoteUpdate,

  /** Activity type when a comment is created. */
  CommentCreation,

  /** Activity type when a comment is deleted. */
  CommentDelete,

  /** Activity type when a role is created. */
  RoleCreation,

  /** Activity type when a role is deleted. */
  RoleDelete,

  /** Activity type when a role is updated. */
  RoleUpdate,

  /** Activity type when permissions of a role are updated. */
  RolePermissionsUpdate,

  /** Activity type when a member is added. */
  MemberAdd,

  /** Activity type when a member is removed. */
  MemberRemove,

  /** Activity type when a role is added to a member at the board level. */
  MemberRolesBoardAdd,

  /** Activity type when a role is removed from a member at the board level. */
  MemberRolesBoardRemove,

  /** Activity type when a role is added to a member at the project level. */
  MemberRolesProjectAdd,

  /** Activity type when a role is removed from a member at the project level. */
  MemberRolesProjectRemove,
}
