import { Reflector } from '@nestjs/core';

import { Permissions as ProjectPermissionsEnum } from '../enums/project.enum';
import { Permissions as TaskPermissionsEnum } from '../enums/tasks.enum';

/**
 * Create a custom decorator for project permissions using Reflector.
 * This decorator will be used to annotate methods or routes that require specific project-related permissions.
 * Example usage: @ProjectPermissions(ProjectPermissionsEnum.UpdateProject)
 */
export const ProjectPermissions =
  Reflector.createDecorator<ProjectPermissionsEnum[]>();

/**
 * Create a custom decorator for board permissions using Reflector.
 * This decorator will be used to annotate methods or routes that require specific board-related permissions.
 * Example usage: @BoardPermissions(ProjectPermissionsEnum.UpdateBoard)
 */
export const BoardPermissions =
  Reflector.createDecorator<ProjectPermissionsEnum[]>();

/**
 * Create a custom decorator for task permissions using Reflector.
 * This decorator will be used to annotate methods or routes that require specific task-related permissions.
 * Example usage: @TaskPermissions(TaskPermissionsEnum.EditTask)
 */
export const TaskPermissions =
  Reflector.createDecorator<TaskPermissionsEnum[]>();
