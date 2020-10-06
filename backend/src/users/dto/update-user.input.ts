import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
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
  @MinLength(8)
  @MaxLength(20)
  @Field()
  old_password: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Field()
  password: string;
}
