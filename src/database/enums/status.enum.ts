/**
 * Enumeration describing the possible states of a project.
 * Each state represents a specific phase in the project's lifecycle.
 */
export enum ProjectStatus {
  /**
   * Indicates that the project has successfully reached its end.
   * All or most of its objectives have been met, and all related boards are finalized.
   * The project is now in a read-only mode for future reference.
   */
  Completed,

  /**
   * Signifies that the project is actively being worked on.
   * At this phase, a start date for the project is already set, and tasks are being executed.
   */
  InProgress,

  /**
   * Represents a temporary halt in the project's execution.
   * During this state, changes to the project are restricted until it's resumed.
   */
  Paused,

  /**
   * This is the preliminary state of the project.
   * It indicates that the project has been defined, but active management or execution hasn't begun.
   */
  Planned,

  /**
   * Indicates that the project has been terminated before its completion.
   * The project is in read-only mode, preserving its state for reference.
   */
  Cancelled,
}

/**
 * Enumeration detailing the potential statuses a project's goal can be in.
 * These statuses provide insights into the progression or completion of individual goals within a project.
 */
export enum ProjectGoalsStatus {
  /**
   * Denotes that the goal was deemed unachievable or irrelevant and has therefore been terminated.
   * Important goals that are integral to the project's history cannot be removed entirely but are marked as cancelled.
   */
  Cancelled,

  /**
   * Indicates that the goal has been fully achieved.
   */
  Completed,

  /**
   * Represents that active efforts are being made towards achieving this goal.
   */
  InProgress,

  /**
   * This status signifies that the goal has been set and acknowledged,
   * but there hasn't been a decision on when to start working towards it.
   */
  Planned,
}
