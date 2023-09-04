import { registerEnumType } from '@nestjs/graphql';

import { ActivityHistory } from './database/entities/project/activity-history';
import { CommentsTypes } from './database/enums/comments.enum';
import { DeviceTypes } from './database/enums/devices.enum';
import {
  ProjectGoalsStatus,
  ProjectStatus,
} from './database/enums/status.enum';
import { TokenType } from './database/enums/token.enum';

registerEnumType(ActivityHistory, {
  name: 'ActivityHistory',
});

registerEnumType(CommentsTypes, {
  name: 'ActivityHistory',
});

registerEnumType(DeviceTypes, {
  name: 'ActivityHistory',
});

registerEnumType(ProjectStatus, {
  name: 'ActivityHistory',
});

registerEnumType(ProjectGoalsStatus, {
  name: 'ActivityHistory',
});

registerEnumType(TokenType, {
  name: 'ActivityHistory',
});
