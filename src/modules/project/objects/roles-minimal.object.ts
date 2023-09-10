import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * The `ProjectRolesObject` class serves as a blueprint for defining roles within a project management system.
 * In many applications, especially in project management platforms, roles are fundamental for access control,
 * where different roles can perform different tasks based on their set permissions.
 *
 * This particular implementation utilizes a bit-based permission system, which provides an efficient way
 * to store and manage permissions. Using bits, each role can have a combination of permissions represented
 * as a single integer, making it easy to perform operations like checking, granting, or revoking permissions.
 */
@ObjectType({
  description:
    'Object that represents the minimum information about board roles.',
})
export class ProjectRolesMinimalObject {
  /**
   * The `id` field represents a unique identifier for each role within the system.
   * This ensures that each role can be distinctively identified, especially during operations
   * like assignment, modification, or deletion.
   */
  @Field(() => ID, { description: 'Unique identifier for the project role.' })
  public id!: string;

  /**
   * The `name` field provides a human-readable representation of the role. This is typically
   * used for display purposes and for users to understand the purpose of a given role.
   */
  @Field(() => String, { description: 'Name representing the role.' })
  public name!: string;

  /**
   * The `permissions` field represents the bit-based permission value for the role. Using bits,
   * a role can have a combination of permissions represented as a single integer. This makes it
   * easier and more efficient to manage and verify permissions.
   */
  @Field(() => Number, { description: 'Role bit-based permissions.' })
  public permissions!: number;
}
