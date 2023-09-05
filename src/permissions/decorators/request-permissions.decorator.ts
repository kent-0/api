import { Reflector } from '@nestjs/core';

import { Permissions as ProjectPermissionsEnum } from '../enums/project.enum';
import { Permissions as TaskPermissionsEnum } from '../enums/tasks.enum';

export const ProjectPermissions =
  Reflector.createDecorator<ProjectPermissionsEnum[]>();

export const TaskPermissions =
  Reflector.createDecorator<TaskPermissionsEnum[]>();
