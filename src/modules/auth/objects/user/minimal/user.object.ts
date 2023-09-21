import { Field, ID, ObjectType } from '@nestjs/graphql';

import { tuple } from '~/utils/functions/tuple';

/**
 * Represents a tuple containing the minimal set of properties
 * required to identify and display basic information for an authenticated user.
 *
 * This tuple is designed to be used in conjunction with the `createFieldPaths`
 * function to generate fully qualified paths for accessing specific fields
 * within nested objects or database structures.
 *
 * By having this tuple, it standardizes the essential fields for an authenticated user
 * across the application, ensuring consistency and reducing chances of errors.
 * This can be especially useful when selecting nested properties from databases
 * or filtering nested properties in API responses.
 *
 * @constant AuthUserMinimalProperties
 *
 * @example
 * If you want to generate field paths for an entity named 'user':
 *
 * const fieldPaths = createFieldPaths('user', ...AuthUserMinimalProperties);
 * // Returns: ['user.id', 'user.first_name', 'user.last_name', 'user.username']
 */
export const AuthUserMinimalProperties = tuple(
  'id',
  'first_name',
  'last_name',
  'username',
  'biography',
);

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
export class AuthUserMinimalObject {
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
