import { Reflector } from '@nestjs/core';

import { Permissions as BoardPermissionsEnum } from '../enums/board.enum';
import { Permissions as ProjectPermissionsEnum } from '../enums/project.enum';

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
  Reflector.createDecorator<BoardPermissionsEnum[]>();
