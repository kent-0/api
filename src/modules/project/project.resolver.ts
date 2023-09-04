import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UpdateProjectInput } from './inputs';
import { CreateProjectInput } from './inputs/project-create.input';
import { ProjectObject } from './objects/project.object';
import { ProjectService } from './services/project.service';

import { UserToken } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { JWTPayload } from '../auth/interfaces/jwt.interface';

@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard)
export class ProjectResolver {
  constructor(private _projectService: ProjectService) {}

  @Mutation(() => ProjectObject, {
    description: 'Create a new project.',
    name: 'createProject',
  })
  public create(
    @Args('input') input: CreateProjectInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._projectService.create(input, token.sub);
  }

  @Mutation(() => String, {
    description: 'Delete a project.',
    name: 'deleteProject',
  })
  public delete(
    @Args('projectId') projectId: string,
    @UserToken() token: JWTPayload,
  ) {
    return this._projectService.delete(projectId, token.sub);
  }

  @Mutation(() => ProjectObject, {
    description: 'Get a project.',
    name: 'getProject',
  })
  public get(
    @Args('projectId') projectId: string,
    @UserToken() token: JWTPayload,
  ) {
    return this._projectService.get(projectId, token.sub);
  }

  @Mutation(() => ProjectObject, {
    description: 'Update current project.',
    name: 'updateProject',
  })
  public update(@Args('input') input: UpdateProjectInput) {
    return this._projectService.update(input);
  }
}
