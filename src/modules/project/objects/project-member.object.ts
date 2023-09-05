import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * The `ProjectMemberObject` class is a structured representation of a user
 * within the context of a project management system. Every member in a
 * project has unique identifiers and personal details such as their first
 * name, last name, and username.
 *
 * This class defines the shape of the data when querying or mutating member
 * information within a GraphQL API. It ensures consistency in how user data
 * is presented and interacted with across the system.
 */
@ObjectType({
  description: 'Information about all users on the platform.',
})
export class ProjectMemberObject {
  /**
   * The first name of a user provides a personal touch when interacting
   * within the system. It can be used in user interfaces to greet the user
   * or identify them among other members.
   */
  @Field({
    description: 'First name of the user.',
  })
  public first_name!: string;

  /**
   * Every member within the system is assigned a unique identifier. This
   * identifier is essential for operations such as querying a specific
   * member's details, updating their information, or referencing them in
   * relational data structures.
   */
  @Field(() => ID, { description: 'Unique identifier for the project.' })
  public id!: string;

  /**
   * Alongside the first name, the last name provides a fuller identity
   * for the user. It can be utilized in official communications or when
   * differentiating between users with the same first name.
   */
  @Field({
    description: 'Last name of the user.',
  })
  public last_name!: string;

  /**
   * The username is a unique handle assigned to each user on the platform.
   * It can be used for logins, mentions, or other platform-specific
   * interactions. Ensuring its uniqueness helps avoid conflicts and
   * misidentifications.
   */
  @Field({
    description: 'Unique user name per user.',
  })
  public username!: string;
}
