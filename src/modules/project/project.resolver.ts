import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CreateUpdateProjectInput } from './inputs/create-update-project.input';
import { ProjectObject } from './objects/project.object';
import { ProjectService } from './services/project.service';

import { UserToken } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { JWTPayload } from '../auth/interfaces/jwt.interface';

@Resolver()
@UsePipes(ValidationPipe)
export class ProjectResolver {
  constructor(private _projectService: ProjectService) {}

  @Mutation(() => ProjectObject, {
    description: 'Create a new project.',
    name: 'createProject',
  })
  @UseGuards(JwtAuthGuard)
  public create(
    @Args('input') input: CreateUpdateProjectInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._projectService.create(input, token.sub);
  }
}
