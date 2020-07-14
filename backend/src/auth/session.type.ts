import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Session')
export class SessionType {
  @Field()
  accessToken: string;
}
