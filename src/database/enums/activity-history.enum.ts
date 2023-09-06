/**
 * Represents the various types of activities that can be recorded in the history.
 * Each entry corresponds to a specific action or change made within the system.
 * By tracking these activities, the system provides an audit trail that can be used
 * to understand changes, actions, and events that have occurred over time.
 */
export enum ActivityHistoryTypes {
  /** Indicates that a task has been created. */
  TaskCreation,

  /** Indicates that a task has been deleted. */
  TaskDelete,

  /** Indicates that a task has been moved from one location or status to another. */
  TaskMove,

  /** Indicates that a new step has been created. */
  StepCreation,

  /** Indicates that a step has been deleted. */
  StepDelete,

  /** Indicates that a step has been removed, typically from a larger process or sequence. */
  StepRemove,

  /** Indicates that details or status of a step have been modified. */
  StepUpdate,

  /** Indicates that a new goal has been established. */
  GoalCreation,

  /** Indicates that a goal has been deleted. */
  GoalDelete,

  /** Indicates that a goal has been removed, possibly from a project or objective list. */
  GoalRemove,

  /** Indicates that details or status of a goal have been updated. */
  GoalUpdate,

  /** Indicates that a new note has been added to an item or record. */
  NoteCreation,

  /** Indicates that a note has been deleted. */
  NoteDelete,

  /** Indicates that the content or details of a note have been modified. */
  NoteUpdate,

  /** Indicates that a new comment has been made on an item or discussion thread. */
  CommentCreation,

  /** Indicates that a comment has been deleted. */
  CommentDelete,

  /** Indicates that a new role, defining permissions and access, has been created. */
  RoleCreation,

  /** Indicates that a role has been deleted. */
  RoleDelete,

  /** Indicates that the properties or permissions of a role have been modified. */
  RoleUpdate,

  /** Indicates that the permissions associated with a role have been updated. */
  RolePermissionsUpdate,

  /** Indicates that a new member has been added to a project or team. */
  MemberAdd,

  /** Indicates that a member has been removed from a project or team. */
  MemberRemove,

  /** Indicates that a new role has been added to a member, specifically at the board level. */
  MemberRolesBoardAdd,

  /** Indicates that a role has been removed from a member, specifically at the board level. */
  MemberRolesBoardRemove,

  /** Indicates that a new role has been added to a member, specifically at the project level. */
  MemberRolesProjectAdd,

  /** Indicates that a role has been removed from a member, specifically at the project level. */
  MemberRolesProjectRemove,
}
