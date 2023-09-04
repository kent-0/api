import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Module } from '@nestjs/common';

import { ProjectEntity, ProjectMembersEntity } from '~/database/entities';

import { ProjectResolver } from './project.resolver';
import { ProjectService } from './services/project.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [ProjectEntity, ProjectMembersEntity],
    }),
  ],
  providers: [ProjectService, ProjectResolver],
})
export class ProjectModule {}
