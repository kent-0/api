import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Module } from '@nestjs/common';

import { BoardEntity, BoardMembersEntity } from '~/database/entities';

import { BoardResolver } from './resolvers/board.resolver';
import { BoardService } from './services/board.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [BoardEntity, BoardMembersEntity] }),
  ],
  providers: [BoardService, BoardResolver],
})
export class BoardModule {}
