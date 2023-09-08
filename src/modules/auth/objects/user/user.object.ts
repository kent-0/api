import { Field, ID, ObjectType } from '@nestjs/graphql';

import { ProjectMembersObject } from '~/modules/project/objects';

/**
 * Represents an email associated with a user account. This object typically contains
 * the email address itself and a flag indicating whether the email has been confirmed
 * (typically through a verification process).
 *
 * The class is also decorated with GraphQL decorators, making it possible to use
 * as a return type in GraphQL queries or mutations related to user email information.
 */
@ObjectType({
  description:
    'Represents an email address associated with a user account and its confirmation status.',
})
export class AuthUserEmailObject {
  /**
   * Indicates whether the email address associated with the user account has been confirmed.
   * Email confirmation is typically a process where the user receives an email with a verification
   * link or code, and upon interacting with it, the email is marked as confirmed.
   *
   * @type {boolean}
   * @description Flag indicating if the email has been confirmed.
   * @required
   */
  @Field({
    description: 'Indicates if the associated email address is confirmed.',
  })
  public is_confirmed!: boolean;

  /**
   * The email address associated with the user account. This is the primary method
   * of communication with the user and is often used for logging into the platform.
   *
   * @type {string}
   * @description The actual email address of the user.
   * @required
   */
  @Field({
    description: 'The actual email address linked to the user account.',
  })
  public value!: string;
}

/**
 * Represents a user's basic information on the platform. This includes details
 * like their unique identifier, first name, last name, username, and associated email.
 *
 * Like the previous class, this one is also decorated with GraphQL decorators, making
 * it suitable for use in GraphQL queries or mutations related to user information.
 */
@ObjectType({
  description:
    'Contains the core profile information of a user on the platform.',
})
export class AuthUserObject {
  /**
   * Represents the email associated with the user's account. The email object
   * also contains information about whether the email is confirmed.
   *
   * @type {AuthUserEmailObject}
   * @description The email entity associated with the user.
   * @required
   */
  @Field({
    description:
      'Email details, including the address and its confirmation status, associated with the user account.',
  })
  public email!: AuthUserEmailObject;

  /**
   * The first name of the user. This is typically the given name of the user.
   *
   * @type {string}
   * @description The user's first name.
   * @required
   */
  @Field({
    description: "User's first or given name.",
  })
  public first_name!: string;

  /**
   * Represents a unique identifier for the user. This is typically a string
   * (often a UUID) that uniquely identifies a user in the system.
   *
   * @type {string}
   * @description A unique string identifier for the user.
   * @required
   */
  @Field(() => ID, {
    description: 'Unique identifier for the user, typically in UUID format.',
  })
  public id!: string;

  /**
   * The last name or surname of the user.
   *
   * @type {string}
   * @description The user's last or family name.
   * @required
   */
  @Field({
    description: "User's last or family name.",
  })
  public last_name!: string;

  /**
   * Represents the projects in which the user is a member. This property provides an overview
   * of all the projects associated with the user, allowing them to quickly access and manage
   * their project memberships. Each project entry will contain essential details such as the
   * project name, role of the user in that project, and other relevant metadata.
   *
   * @type {ProjectMembersObject[]}
   * @description A list of projects where the user has membership.
   */
  @Field(() => [ProjectMembersObject], {
    description: 'Projects in which the user is a member.',
    nullable: true,
  })
  public projects!: ProjectMembersObject[];

  /**
   * Represents a unique username associated with the user. This is often a
   * name chosen by the user and is used for logging in, mentioning the user,
   * or other platform-specific interactions.
   *
   * @type {string}
   * @description A unique username for the user.
   * @required
   */
  @Field({
    description:
      'Unique username chosen by the user for platform-specific interactions.',
  })
  public username!: string;
}
