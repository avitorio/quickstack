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
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @MaxLength(20)
  @Field()
  password: string;
}
