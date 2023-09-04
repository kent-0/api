import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Module } from '@nestjs/common';

import { ProjectEntity, ProjectMembersEntity } from '~/database/entities';
import { PermissionManagerService } from '~/permissions/services/manager.service';

import { ProjectResolver } from './project.resolver';
import { ProjectService } from './services/project.service';

@Module({
  imports: [
    // Importing MikroORM module for features related to ProjectEntity and ProjectMembersEntity.
    MikroOrmModule.forFeature({
      entities: [ProjectEntity, ProjectMembersEntity],
    }),
  ],
  providers: [ProjectService, ProjectResolver, PermissionManagerService],
})
export class ProjectModule {}
