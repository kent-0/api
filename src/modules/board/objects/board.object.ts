import { Field, ObjectType } from '@nestjs/graphql';

import { AuthUserMinimalObject } from '~/modules/auth/objects';
import { ProjectMinimalObject } from '~/modules/project/objects';

@ObjectType({
  description: 'Object that represents information on a project board.',
})
export class BoardObject {
  @Field(() => AuthUserMinimalObject, {
    description: 'Basic information about the board creator.',
  })
  public created_by!: AuthUserMinimalObject;

  @Field(() => String, {
    description: 'Brief description that explains what the board is about.',
  })
  public description!: string;

  @Field(() => String, {
    description: "Project's name.",
  })
  public name!: string;

  @Field(() => ProjectMinimalObject, {
    description:
      'Basic information of the project where the board is assigned.',
  })
  public project!: ProjectMinimalObject;
}
