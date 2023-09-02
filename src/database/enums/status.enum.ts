/**
 * States in which a project listed in numbers can be.
 */
export enum ProjectStatus {
  /**
   * The project has been completed, achieving all or most of its goals and completing its boards.
   * From this point the project remains read-only.
   */
  Completed,

  /**
   * The project has been started and its execution is in progress. At this point a start date has already been indicated.
   */
  InProgress,

  /**
   * The project has been paused, so read-only mode is enabled until it goes back to the in-progress state.
   */
  Paused,

  /**
   * Initial state of the project. At this point the project has just been created or has not been fully managed.
   */
  Planned,

  /**
   * The project has been cancelled. Read-only mode is enabled.
   */
  Cancelled,
}

/**
 * The types of status that a goal can have listed by numbers.
 */
export enum ProjectGoalsStatus {
  /**
   * The goal could not be completed so it has been cancelled.
   * Default goals cannot be deleted and are only marked as canceled for history.
   */
  Cancelled,

  /**
   * The goal has been completed.
   */
  Completed,

  /**
   * The goal is in the process of execution.
   */
  InProgress,

  /**
   * The goal has been created but there is still no estimated date to try to achieve it.
   */
  Planned,
}
