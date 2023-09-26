import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UserToken } from '~/modules/auth/decorators/user.decorator';
import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { JWTPayload } from '~/modules/auth/interfaces/jwt.interface';

import { ProjectPermissionsGuard } from '../guards/permissions.guard';
import {
  ProjectNoteCreateInput,
  ProjectNoteRemoveInput,
  ProjectNoteUpdateInput,
} from '../inputs';
import { ProjectNoteObject } from '../objects';
import { ProjectNoteService } from '../services/note.service';

/**
 * Resolver class for managing project note-related GraphQL operations.
 *
 * This resolver handles GraphQL mutations related to creating, deleting, and updating project notes.
 * The resolver is generally protected by JWT authentication and specific project permissions.
 *
 * @UsePipes(ValidationPipe) - Ensures that the incoming data is validated against the defined DTOs.
 * @UseGuards(JwtAuthGuard, ProjectPermissionsGuard) - Protects resolver methods using JWT authentication and project-specific permissions.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, ProjectPermissionsGuard)
export class ProjectNoteResolver {
  /**
   * Initializes the resolver with the necessary services.
   *
   * @param _projectNotesService - Service responsible for project note-related operations.
   */
  constructor(private _projectNotesService: ProjectNoteService) {}

  /**
   * Creates a new project note.
   *
   * @param input - Data containing details about the new project note.
   * @param token - User token payload.
   *
   * @returns Details of the newly created project note.
   */
  @Mutation(() => ProjectNoteObject, {
    description: 'Create a new project note.',
    name: 'projectNoteCreate',
  })
  public create(
    @Args('input') input: ProjectNoteCreateInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._projectNotesService.create(input, token.sub);
  }

  /**
   * Deletes a specified project note based on the given input data.
   *
   * @param input - Data containing details of the project note to delete.
   * @param token - User token payload.
   *
   * @returns A message confirming successful deletion or details of the deleted note.
   */
  @Mutation(() => String, {
    description: 'Delete a project note.',
    name: 'projectNoteDelete',
  })
  public delete(
    @Args('input') input: ProjectNoteRemoveInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._projectNotesService.delete(input, token.sub);
  }

  /**
   * Updates and returns the details of a specified project note.
   *
   * @param input - Data containing updated project note details.
   * @param token - User token payload.
   *
   * @returns Updated details of the project note.
   */
  @Mutation(() => ProjectNoteObject, {
    description: 'Update a project note.',
    name: 'projectNoteUpdate',
  })
  public update(
    @Args('input') input: ProjectNoteUpdateInput,
    @UserToken() token: JWTPayload,
  ) {
    return this._projectNotesService.update(input, token.sub);
  }
}
