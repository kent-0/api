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

  @Mutation(() => ProjectObject, {
    description: 'Updater current project.',
    name: 'updateProject',
  })
  public update(@Args('input') input: UpdateProjectInput) {
    return this._projectService.update(input);
  }
}
