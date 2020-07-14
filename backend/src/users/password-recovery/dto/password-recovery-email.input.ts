import { IsString, MinLength, IsEmail } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PasswordRecoveryEmailInput {
  @IsString()
  @IsEmail()
  @MinLength(4)
  @Field()
  email: string;
}
