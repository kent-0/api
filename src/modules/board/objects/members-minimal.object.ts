import { Field, ID, ObjectType } from '@nestjs/graphql';

import { AuthUserMinimalObject } from '~/modules/auth/objects';

import { BoardRolesMinimalObject } from './roles-minimal.object';

/**
 * Represents a minimalistic view of members associated with a board.
 * This object type is optimized for scenarios where only essential member details
 * are needed, such as listing members without overwhelming the client with excessive data.
 * Each board member will have an ID, a list of roles, and a minimal user profile.
 */
@ObjectType({
  description: 'Object representing the minimal users invited data to boards.',
})
export class BoardMembersMinimalObject {
  /**
   * A unique identifier for the member within the context of the board.
   * This ID helps differentiate members, especially in scenarios where actions
   * need to be performed on individual members, such as updating roles or removing members.
   *
   * @type {string}
   * @required
   */
  @Field(() => ID, {
    description: 'Member ID inside the board',
  })
  public id!: string;

  /**
   * A list of roles associated with the board member. Each role provides
   * specific permissions that dictate what actions the member can perform within the board.
   * This list can be used to display role assignments and make decisions on permission checks.
   *
   * @type {BoardRolesMinimalObject[]}
   * @required
   */
  @Field(() => [BoardRolesMinimalObject], {
    description: 'User member roles in the board.',
  })
  public roles!: BoardRolesMinimalObject[];

  /**
   * A minimalistic view of the user's profile associated with the board member.
   * This includes core identification details but omits in-depth profile data.
   * Useful for displaying member names or avatars without fetching full user profiles.
   *
   * @type {AuthUserMinimalObject}
   * @required
   */
  @Field(() => AuthUserMinimalObject, {
    description: 'User member of the board.',
  })
  public user!: AuthUserMinimalObject;
}
