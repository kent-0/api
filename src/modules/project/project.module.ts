import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Module } from '@nestjs/common';

import {
  ProjectEntity,
  ProjectMembersEntity,
  ProjectRolesEntity,
} from '~/database/entities';
import { PermissionManagerService } from '~/permissions/services/manager.service';

import { ProjectResolver } from './project.resolver';
import { ProjectService } from './services/project.service';
import { ProjectRolesService } from './services/roles.service';

@Module({
  imports: [
    // Importing MikroORM module for features related to ProjectEntity and ProjectMembersEntity.
    MikroOrmModule.forFeature({
      entities: [ProjectEntity, ProjectMembersEntity, ProjectRolesEntity],
    }),
  ],
  providers: [
    ProjectService,
    ProjectResolver,
    PermissionManagerService,
    ProjectRolesService,
  ],
})
export class ProjectModule {}
