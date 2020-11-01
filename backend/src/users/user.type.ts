import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType('User')
export class UserType {
  @Field(type => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  role: string;
}

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}
