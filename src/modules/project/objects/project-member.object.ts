import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * Object type representing information about a user on the platform.
 */
@ObjectType({
  description: 'Information about all users on the platform.',
})
export class ProjectMemberObject {
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
