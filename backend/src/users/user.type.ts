import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Paginated } from '../types/paginated.types';

@ObjectType('User')
export class UserType {
  @Field(type => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  role: string;
}

@ObjectType()
export class PaginatedUser extends Paginated(UserType) {}
