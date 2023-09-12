import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Module } from '@nestjs/common';

import {
  ProjectEntity,
  ProjectGoalsEntity,
  ProjectMembersEntity,
  ProjectNotesEntity,
  ProjectRolesEntity,
} from '~/database/entities';
import { PermissionManagerService } from '~/permissions/services/manager.service';

import { ProjectGoalsResolver } from './resolvers/goals.resolver';
import { ProjectMembersResolver } from './resolvers/members.resolver';
import { ProjectNotesResolver } from './resolvers/notes.resolver';
import { ProjectResolver } from './resolvers/project.resolver';
import { ProjectRolesResolver } from './resolvers/roles.resolver';
import { ProjectGoalsService } from './services/goals.service';
import { ProjectMembersService } from './services/members.service';
import { ProjectService } from './services/project.service';
import { ProjectRolesService } from './services/roles.service';

/**
 * The `ProjectModule` class is a NestJS module responsible for grouping together
 * all the components associated with the project functionality. It encompasses the
 * database entities related to projects, the services that operate on these entities,
 * and the GraphQL resolver which exposes the API endpoints for client interactions.
 *
 * Key responsibilities:
 * - Import necessary database entities and modules to ensure Dependency Injection is correctly resolved.
 * - Register services and resolvers to manage project-related functionalities.
 */
@Module({
  imports: [
    // MikroORM module is imported to utilize database operations for entities associated with the project.
    // This ensures that the ORM can correctly interact with these entities.
    MikroOrmModule.forFeature({
      entities: [
        ProjectEntity,
        ProjectMembersEntity,
        ProjectRolesEntity,
        ProjectGoalsEntity,
        ProjectNotesEntity,
      ],
    }),
  ],
  providers: [
    ProjectService,
    ProjectResolver,
    ProjectGoalsResolver,
    ProjectNotesResolver,
    ProjectRolesResolver,
    ProjectMembersResolver,
    PermissionManagerService,
    ProjectRolesService,
    ProjectMembersService,
    ProjectGoalsService,
    ProjectMembersService,
    ProjectRolesService,
  ],
})
export class ProjectModule {}
