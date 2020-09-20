import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @IsString()
  @IsEmail()
  @MinLength(4)
  @Field()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Field()
  password: string;
}
