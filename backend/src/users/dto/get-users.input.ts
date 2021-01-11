import { IsNumber, IsOptional, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GetUsersInput {
  @IsNumber()
  @Field()
  limit: number;

  @IsNumber()
  @Field()
  page: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  route?: string;
}
