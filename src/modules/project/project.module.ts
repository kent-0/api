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

import { ProjectGoalResolver } from './resolvers/goal.resolver';
import { ProjectMemberResolver } from './resolvers/member.resolver';
import { ProjectNoteResolver } from './resolvers/note.resolver';
import { ProjectResolver } from './resolvers/project.resolver';
import { ProjectRoleResolver } from './resolvers/role.resolver';
import { ProjectGoalService } from './services/goal.service';
import { ProjectMemberService } from './services/member.service';
import { ProjectNoteService } from './services/note.service';
import { ProjectService } from './services/project.service';
import { ProjectRoleService } from './services/role.service';

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
    ProjectGoalResolver,
    ProjectNoteResolver,
    ProjectRoleResolver,
    ProjectMemberResolver,
    PermissionManagerService,
    ProjectRoleService,
    ProjectMemberService,
    ProjectGoalService,
    ProjectMemberService,
    ProjectRoleService,
    ProjectNoteService,
  ],
})
export class ProjectModule {}
