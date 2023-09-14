import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Module } from '@nestjs/common';

import {
  BoardEntity,
  BoardMembersEntity,
  BoardRolesEntity,
} from '~/database/entities';

import { BoardResolver } from './resolvers/board.resolver';
import { BoardMembersResolver } from './resolvers/member.resolver';
import { BoardRolesResolver } from './resolvers/role.resolver';
import { BoardService } from './services/board.service';
import { BoardMemberService } from './services/member.service';
import { BoardRoleService } from './services/role.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [
        BoardEntity,
        BoardMembersEntity,
        BoardRolesEntity,
        BoardMembersEntity,
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
  ],
})
export class BoardModule {}
