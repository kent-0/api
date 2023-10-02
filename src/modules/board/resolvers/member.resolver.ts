import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '~/modules/auth/guards/jwt.guard';
import { BoardPermissions } from '~/permissions/decorators/request-permissions.decorator';
import { BoardPermissionsEnum } from '~/permissions/enums/board.enum';

import { BoardPermissionsGuard } from '../guards/permissions.guard';
import { AddRemoveBoardMemberInput } from '../inputs';
import { BoardMembersObject } from '../objects';
import { BoardMemberService } from '../services/member.service';
/**
 * Resolver class for handling board-related operations.
 *
 * This resolver handles GraphQL mutations and queries related to adding and removing members from a board.
 * It's protected by JWT authentication and specific board permissions.
 *
 * @UsePipes(ValidationPipe) - Ensures that the incoming data is validated against the defined DTOs.
 * @UseGuards(JwtAuthGuard, BoardPermissionsGuard) - Protects the resolver using JWT authentication and board-specific permissions.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard, BoardPermissionsGuard)
export class BoardMembersResolver {
  /**
   * Initializes the resolver with the necessary service.
   *
   * @param _memberServie - Service responsible for board member-related operations.
   */
  constructor(private _memberServie: BoardMemberService) {}

  /**
   * Adds a user as a member of a board.
   * Steps:
   * 1. Calls the member service's add method with provided input to add the user as a board member.
   *
   * @param input - Data containing information about the user and board.
   * @returns The added board member's details.
   */
  @Mutation(() => BoardMembersObject, {
    description: 'Add a user as a member of a board.',
    name: 'boardMemberAdd',
  })
  @BoardPermissions([BoardPermissionsEnum.MemberAdd])
  public add(@Args('input') input: AddRemoveBoardMemberInput) {
    return this._memberServie.add(input);
  }

  /**
   * Removes a user from a board's member list.
   * Steps:
   * 1. Calls the member service's remove method with provided input to remove the user from the board.
   *
   * @param input - Data containing information about the user and board.
   * @returns The removed board member's details.
   */
  @Mutation(() => BoardMembersObject, {
    description: 'Remove a user from a board.',
    name: 'boardMemberRemove',
  })
  @BoardPermissions([BoardPermissionsEnum.MemberRemove])
  public remove(@Args('input') input: AddRemoveBoardMemberInput) {
    return this._memberServie.remove(input);
  }
}
