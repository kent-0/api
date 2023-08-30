import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserObject {
  @Field()
  public username: string;
}
