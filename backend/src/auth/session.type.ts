import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from '../users/user.type';

@ObjectType('Session')
export class SessionType {
  @Field()
  token: string;

  @Field()
  user: UserType;
}
