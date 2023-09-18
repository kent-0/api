import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Module } from '@nestjs/common';

import {
  BoardEntity,
  BoardMembersEntity,
  BoardRolesEntity,
  BoardStepEntity,
} from '~/database/entities';
import { PermissionManagerService } from '~/permissions/services/manager.service';

import { BoardResolver } from './resolvers/board.resolver';
import { BoardMembersResolver } from './resolvers/member.resolver';
import { BoardRolesResolver } from './resolvers/role.resolver';
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
      ],
    }),
  ],
  providers: [
    BoardService,
    BoardResolver,
    BoardMemberService,
    BoardRoleService,
    BoardMembersResolver,
    BoardRolesResolver,
    BoardStepResolver,
    BoardService,
    BoardMemberService,
    BoardRoleService,
    BoardStepService,
    PermissionManagerService,
  ],
})
export class BoardModule {}
