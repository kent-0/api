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
  name: 'ActivityHistory',
});

registerEnumType(CommentsTypes, {
  name: 'CommentsTypes',
});

registerEnumType(DeviceTypes, {
  name: 'DeviceTypes',
});

registerEnumType(ProjectStatus, {
  name: 'ProjectStatus',
});

registerEnumType(ProjectGoalsStatus, {
  name: 'ProjectGoalsStatus',
});

registerEnumType(TokenType, {
  name: 'TokenType',
});

registerEnumType(QueryOrder, {
  name: 'SortOrder',
});
