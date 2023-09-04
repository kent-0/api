import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * Object type representing an email associated with the user account.
 */
@ObjectType({
  description: 'Email associated with the user account.',
})
export class AuthUserEmailObject {
  /**
   * Email confirmation status.
   */
  @Field({
    description: 'Email confirmation status.',
  })
  public is_confirmed!: boolean;

  /**
   * Email address.
   */
  @Field({
    description: 'Email address',
  })
  public value!: string;
}

/**
 * Object type representing information about a user on the platform.
 */
@ObjectType({
  description: 'Information about all users on the platform.',
})
export class AuthUserObject {
  /**
   * Unique email per user.
   */
  @Field({
    description: 'Unique email per user.',
  })
  public email!: AuthUserEmailObject;

  /**
   * First name of the user.
   */
  @Field({
    description: 'First name of the user.',
  })
  public first_name!: string;

  /**
   * Unique identifier for the project.
   */
  @Field(() => ID, { description: 'Unique identifier for the project.' })
  public id!: string;

  /**
   * Last name of the user.
   */
  @Field({
    description: 'Last name of the user.',
  })
  public last_name!: string;

  /**
   * Unique username per user.
   */
  @Field({
    description: 'Unique user name per user.',
  })
  public username!: string;
}
