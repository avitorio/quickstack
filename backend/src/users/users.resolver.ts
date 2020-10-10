import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ValidationPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { GqlAuthGuard } from '../auth/gql-auth-guard';

const AuthGuard = new GqlAuthGuard();

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(returns => Boolean)
  signUp(
    @Args('createUserInput', ValidationPipe)
    createUserInput: CreateUserInput,
  ): Promise<boolean> {
    return this.usersService.signUp(createUserInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(returns => Boolean)
  updateUser(
    @Args('updateUserInput', ValidationPipe)
    updateUserInput: UpdateUserInput,
    @GetUser()
    user: User,
  ): Promise<boolean> {
    return this.usersService.updateUser(updateUserInput, user);
  }
}
