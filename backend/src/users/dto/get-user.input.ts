import { IsString, IsUUID } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GetUserInput {
  @IsString()
  @IsUUID()
  @Field()
  id: string;
}
