import { InputType, Field } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class CreateTaskInput {
  @MinLength(1)
  @Field()
  title: string;

  @MinLength(1)
  @Field()
  description: string;
}
