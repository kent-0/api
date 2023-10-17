import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { ProjectPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { ProjectPermissionsEnum } from '~/permissions/enums/project.enum';

import { ProjectPermissionsGuard } from '../guards/permissions.guard';
import { ProjectMemberAddRemoveInput } from '../inputs';
import { ProjectMemberObject } from '../objects';
import { ProjectMemberService } from '../services/member.service';

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
export class ProjectMemberResolver {
  /**
   * Initializes the resolver with the necessary service.
   *
   * @param _memberServie - Service responsible for project member-related operations.
   */
  constructor(private _memberServie: ProjectMemberService) {}

  /**
   * Adds a user as a member of a project.
   * Steps:
   * 1. Calls the member service's add method with provided input to add the user as a project member.
   *
   * @param input - Data containing information about the user and project.
   * @returns The added project member's details.
   */
  @Mutation(() => ProjectMemberObject, {
    description: 'Add a user as a member of a project.',
    name: 'projectMemberAdd',
  })
  @ProjectPermissions([ProjectPermissionsEnum.MemberAdd])
  public add(@Args('input') input: ProjectMemberAddRemoveInput) {
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
  @Mutation(() => String, {
    description: 'Remove a user from a project.',
    name: 'projectMemberRemove',
  })
  @ProjectPermissions([ProjectPermissionsEnum.MemberRemove])
  public remove(@Args('input') input: ProjectMemberAddRemoveInput) {
    return this._memberServie.remove(input);
  }
}
