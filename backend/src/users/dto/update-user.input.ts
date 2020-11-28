import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { UserRole } from '../user-role.type';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsUUID()
  id?: string;

  @IsString()
  @IsEmail()
  @MinLength(4)
  @Field()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsOptional()
  @IsString()
  @MinLength(6, {
    message: 'Old password is too short.',
  })
  @MaxLength(20)
  old_password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(6, {
    message: 'Password is too short.',
  })
  @MaxLength(20)
  @Field()
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  role?: UserRole;
}
