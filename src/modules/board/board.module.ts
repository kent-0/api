import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Module } from '@nestjs/common';

import {
  BoardEntity,
  BoardMembersEntity,
  BoardRolesEntity,
  BoardStepEntity,
  BoardTaskEntity,
  ProjectEntity,
} from '~/database/entities';
import { BoardTaskResolver } from '~/modules/board/resolvers/task.resolver';
import { BoardTaskService } from '~/modules/board/services/task.service';
import { PermissionManagerService } from '~/permissions/services/manager.service';

import { BoardResolver } from './resolvers/board.resolver';
import { BoardMembersResolver } from './resolvers/member.resolver';
import { BoardRoleResolver } from './resolvers/role.resolver';
import { BoardStepResolver } from './resolvers/step.resolver';
import { BoardService } from './services/board.service';
import { BoardMemberService } from './services/member.service';
import { BoardRoleService } from './services/role.service';
import { BoardStepService } from './services/step.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [
        BoardEntity,
        BoardMembersEntity,
        BoardRolesEntity,
        BoardMembersEntity,
        BoardStepEntity,
        BoardTaskEntity,
        ProjectEntity,
      ],
    }),
  ],
  providers: [
    BoardService,
    BoardResolver,
    PermissionManagerService,
    BoardMemberService,
    BoardRoleService,
    BoardMembersResolver,
    BoardRoleResolver,
    BoardStepResolver,
    BoardStepService,
    BoardTaskResolver,
    BoardTaskService,
  ],
})
export class BoardModule {}
