import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @IsString()
  @IsEmail()
  @MinLength(4)
  @Field()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6, {
    message: 'Old password is too short.',
  })
  @MaxLength(20)
  @Field()
  old_password: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Field()
  password: string;
}
