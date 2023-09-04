import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { RequestPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { ProjectPermissions } from '~/permissions/enums';

import { ProjectPermissionsGuard } from './guards/permissions.guard';
import { CreateProjectInput, UpdateProjectInput } from './inputs';
import { CreateProjectRoleInput } from './inputs/role-create.input';
import { ProjectObject, ProjectRolesObject } from './objects';
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
  public createRole(@Args('input') input: CreateProjectRoleInput) {
    // Call the 'create' method of the RolesService to create a new role.
    return this._roleService.create(input);
  }

  @Mutation(() => String, {
    description: 'Delete a project.',
  })
  public deleteProject(
    @Args('projectId') projectId: string,
    @UserToken() token: JWTPayload,
  ) {
    // Call the 'delete' method of the ProjectService to delete a project.
    return this._projectService.delete(projectId, token.sub);
  }

  @Mutation(() => ProjectObject, {
    description: 'Get a project.',
  })
  @UseGuards(ProjectPermissionsGuard)
  @RequestPermissions([ProjectPermissions.UpdateProject])
  public getProject(
    @Args('projectId') projectId: string,
    @UserToken() token: JWTPayload,
  ) {
    // Call the 'get' method of the ProjectService to retrieve project details.
    return this._projectService.get(projectId, token.sub);
  }

  @Mutation(() => ProjectObject, {
    description: 'Update current project.',
  })
  public updateProject(@Args('input') input: UpdateProjectInput) {
    // Call the 'update' method of the ProjectService to update a project.
    return this._projectService.update(input);
  }
}
