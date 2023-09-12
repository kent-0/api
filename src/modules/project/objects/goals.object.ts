import { Field, ObjectType } from '@nestjs/graphql';

import { ProjectMinimalObject } from '.';
import { ProjectGoalsMinimalObject } from './goals-minimal.object';

/**
 * The `ProjectGoalsObject` class represents a structured format for goals
 * associated with a specific project. Goals are important milestones or
 * objectives that a project aims to achieve. Each goal is defined by its
 * name, a brief description, its unique identifier, the project it's associated
 * with, and its current status.
 *
 * This class ensures that goals can be represented consistently and
 * can be queried or mutated within a GraphQL API.
 */
@ObjectType({
  description: 'Object representing goals to be achieved in the project.',
})
export class ProjectGoalsObject extends ProjectGoalsMinimalObject {
  /**
   * Linking the goal to a specific project ensures context. This relationship
   * indicates which project the goal belongs to.
   */
  @Field(() => ProjectMinimalObject, {
    description: 'Project assigned to the goal.',
  })
  public project!: ProjectMinimalObject;
}
