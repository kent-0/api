import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Information about all users on the platform.',
})
export class AuthUserObject {
  @Field({
    description: 'Unique email per user.',
  })
  public email!: string;

  @Field({
    description: 'First name of the user.',
  })
  public first_name!: string;

  @Field({
    description: 'Last name of the user.',
  })
  public last_name!: string;

  @Field({
    description: 'Unique user name per user.',
  })
  public username!: string;
}
