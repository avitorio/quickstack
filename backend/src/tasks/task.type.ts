import { Field, ObjectType, ID } from '@nestjs/graphql';
import { TaskStatus } from './task-status.enum';
import { UserType } from '../users/user.type';

@ObjectType('Task')
export class TaskType {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  status: TaskStatus;

  @Field(type => [UserType])
  user_id: string;
}
