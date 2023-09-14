import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { ProjectPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { Permissions } from '~/permissions/enums/project.enum';

import { ProjectPermissionsGuard } from '../guards/permissions.guard';
import { AddRemoveProjectMemberInput } from '../inputs';
import { ProjectMembersObject } from '../objects';
import { ProjectMembersService } from '../services/members.service';

/**
 * Resolver class for handling project-related operations.
 *
 * This resolver handles GraphQL mutations and queries related to adding and removing members from a project.
 * It's protected by JWT authentication and specific project permissions.
 *
 * @UsePipes(ValidationPipe) - Ensures that the incoming data is validated against the defined DTOs.
 * @UseGuards(JwtAuthGuard, ProjectPermissionsGuard) - Protects the resolver using JWT authentication and project-specific permissions.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, ProjectPermissionsGuard)
export class ProjectMembersResolver {
  /**
   * Initializes the resolver with the necessary service.
   *
   * @param _memberServie - Service responsible for project member-related operations.
   */
  constructor(private _memberServie: ProjectMembersService) {}

  /**
   * Adds a user as a member of a project.
   * Steps:
   * 1. Calls the member service's add method with provided input to add the user as a project member.
   *
   * @param input - Data containing information about the user and project.
   * @returns The added project member's details.
   */
  @Mutation(() => ProjectMembersObject, {
    description: 'Add a user as a member of a project.',
    name: 'projectMemberAdd',
  })
  @ProjectPermissions([Permissions.MemberAdd])
  public add(@Args('input') input: AddRemoveProjectMemberInput) {
    return this._memberServie.add(input);
  }

  /**
   * Removes a user from a project's member list.
   * Steps:
   * 1. Calls the member service's remove method with provided input to remove the user from the project.
   *
   * @param input - Data containing information about the user and project.
   * @returns The removed project member's details.
   */
  @Mutation(() => ProjectMembersObject, {
    description: 'Remove a user from a project.',
    name: 'projectMemberRemove',
  })
  @ProjectPermissions([Permissions.MemberRemove])
  public remove(@Args('input') input: AddRemoveProjectMemberInput) {
    return this._memberServie.remove(input);
  }
}
