import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
  @IsString()
  @MinLength(4)
  @Field()
  token: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  @Field()
  password: string;
}
