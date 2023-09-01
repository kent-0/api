import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthUserObject {
  @Field()
  public username!: string;
}
