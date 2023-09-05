import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RequestPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { Permissions } from '~/permissions/enums/project.enum';

import { ProjectPermissionsGuard } from './guards/permissions.guard';
import {
  CreateProjectInput,
  UnassignProjectRoleInput,
  UpdateProjectInput,
  UpdateProjectRoleInput,
} from './inputs';
import { AssignProjectRoleInput } from './inputs/role-assign.input';
import { CreateProjectRoleInput } from './inputs/role-create.input';
import { ProjectRolePaginationInput } from './inputs/role-pagination';
import {
  ProjectMembersObject,
  ProjectObject,
  ProjectPaginatedProjectRoles,
  ProjectRolesObject,
} from './objects';
import { ProjectService } from './services/project.service';
import { ProjectRolesService } from './services/roles.service';

import { UserToken } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { JWTPayload } from '../auth/interfaces/jwt.interface';

@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard)
export class ProjectResolver {
  constructor(
    private _projectService: ProjectService,
    private _roleService: ProjectRolesService,
  ) {}

  @Mutation(() => ProjectMembersObject, {
    description: 'Assign project role to members.',
  })
  @UseGuards(ProjectPermissionsGuard)
  public assignRole(@Args('input') input: AssignProjectRoleInput) {
    // Call the 'update' method of the RoleService to assign a role to member.
    return this._roleService.assign(input);
  }

  @Mutation(() => ProjectObject, {
    description: 'Create a new project.',
  })
  public createProject(
    @Args('input') input: CreateProjectInput,
    @UserToken() token: JWTPayload,
  ) {
    // Call the 'create' method of the ProjectService to create a new project.
    return this._projectService.create(input, token.sub);
  }

  @Mutation(() => ProjectRolesObject, {
    description: 'Create a new project role.',
  })
  @UseGuards(ProjectPermissionsGuard)
  public createRole(@Args('input') input: CreateProjectRoleInput) {
    // Call the 'create' method of the RolesService to create a new role.
    return this._roleService.create(input);
  }

  @Mutation(() => String, {
    description: 'Delete a project.',
  })
  @UseGuards(ProjectPermissionsGuard)
  public deleteProject(
    @Args('projectId') projectId: string,
    @UserToken() token: JWTPayload,
  ) {
    // Call the 'delete' method of the ProjectService to delete a project.
    return this._projectService.delete(projectId, token.sub);
  }

  @Mutation(() => String, {
    description: 'Delete a project role.',
  })
  @UseGuards(ProjectPermissionsGuard)
  public deleteRole(@Args('roleId') roleId: string) {
    // Call the 'delete' method of the RoleService to delete a role.
    return this._roleService.delete(roleId);
  }

  @Query(() => ProjectObject, {
    description: 'Get a project.',
  })
  @UseGuards(ProjectPermissionsGuard)
  @RequestPermissions([Permissions.UpdateProject])
  public getProject(@Args('projectId') projectId: string) {
    // Call the 'get' method of the ProjectService to retrieve project details.
    return this._projectService.get(projectId);
  }

  @Query(() => ProjectPaginatedProjectRoles, {
    description: 'Update role of a project.',
  })
  @UseGuards(ProjectPermissionsGuard)
  public projectRoles(@Args('input') input: ProjectRolePaginationInput) {
    // Call the 'paginate' method of the RoleService to paginate available roles in the project.
    return this._roleService.paginate(input);
  }

  @Mutation(() => ProjectMembersObject, {
    description: 'Assign project role to members.',
  })
  @UseGuards(ProjectPermissionsGuard)
  public unassignRole(@Args('input') input: UnassignProjectRoleInput) {
    // Call the 'update' method of the RoleService to unassign a role to member.
    return this._roleService.unassing(input);
  }

  @Mutation(() => ProjectObject, {
    description: 'Update current project.',
  })
  @UseGuards(ProjectPermissionsGuard)
  public updateProject(@Args('input') input: UpdateProjectInput) {
    // Call the 'update' method of the ProjectService to update a project.
    return this._projectService.update(input);
  }

  @Mutation(() => ProjectRolesObject, {
    description: 'Update role of a project.',
  })
  @UseGuards(ProjectPermissionsGuard)
  public updateRole(@Args('input') input: UpdateProjectRoleInput) {
    // Call the 'update' method of the RoleService to update a role.
    return this._roleService.update(input);
  }
}
