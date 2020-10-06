import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
  @IsString()
  @MinLength(4)
  @Field()
  token: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Field()
  password: string;
}
