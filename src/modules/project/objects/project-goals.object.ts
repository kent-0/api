import { Field, ID, ObjectType } from '@nestjs/graphql';

import { ProjectGoalsStatus } from '~/database/enums/status.enum';

import { ProjectObject } from '.';

/**
 * Represents goals to be achieved in the project.
 */
@ObjectType({
  description: 'Object representing goals to be achieved in the project.',
})
export class ProjectGoalsObject {
  /**
   * Brief description of the goal to achieve.
   */
  @Field(() => String, {
    description: 'Brief description of the goal to achieve.',
  })
  public description!: string;

  /**
   * Unique identifier for the project goal.
   */
  @Field(() => ID, { description: 'Unique identifier for the project goal.' })
  public id!: string;

  /**
   * Name of the goal to achieve.
   */
  @Field(() => String, { description: 'Name of the goal to achieve.' })
  public name!: string;

  /**
   * Project assigned to the goal.
   */
  @Field(() => ProjectObject, { description: 'Project assigned to the goal.' })
  public project!: ProjectObject;

  /**
   * Current status of the goal.
   */
  @Field(() => ProjectGoalsStatus, {
    description: 'Current status of the goal.',
  })
  public status!: ProjectGoalsStatus;
}
