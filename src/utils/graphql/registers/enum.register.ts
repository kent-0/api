import { QueryOrder } from '@mikro-orm/core';

import { registerEnumType } from '@nestjs/graphql';

import { ActivityHistory } from '../../../database/entities/project/activity-history';
import { CommentsTypes } from '../../../database/enums/comments.enum';
import { DeviceTypes } from '../../../database/enums/devices.enum';
import {
  ProjectGoalsStatus,
  ProjectStatus,
} from '../../../database/enums/status.enum';
import { TokenType } from '../../../database/enums/token.enum';

registerEnumType(ActivityHistory, {
  description: 'Tipo de actividad de auditoria de un projecto o tablero.',
  name: 'ActivityHistory',
});

registerEnumType(CommentsTypes, {
  description:
    'Types of comments in board tasks. For example, a comment that opens a discussion or a comment that replies to one.',
  name: 'CommentsTypes',
});

registerEnumType(DeviceTypes, {
  description: 'Type of devices used to log in.',
  name: 'DeviceTypes',
});

registerEnumType(ProjectStatus, {
  description: 'Current status of the project.',
  name: 'ProjectStatus',
});

registerEnumType(ProjectGoalsStatus, {
  description: 'Current status of the goals registered in the project.',
  name: 'ProjectGoalsStatus',
});

registerEnumType(TokenType, {
  description:
    'Types of user account access tokens. These can be authentication or refresh.',
  name: 'TokenType',
});

registerEnumType(QueryOrder, {
  description: 'Types of order for the pagination of elements.',
  name: 'SortOrder',
});
