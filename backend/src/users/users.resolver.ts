import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { ValidationPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth-guard';
import { UserRole, UserType } from './user.type';
import { hasRoles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetUserInput } from './dto/get-user.input';

const AuthGuard = new GqlAuthGuard();

@Resolver(of => UserType)
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

  @hasRoles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Query(() => [UserType])
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Query(() => UserType)
  getUser(
    @Args('getUserInput', ValidationPipe)
    getUserInput: GetUserInput,
  ): Promise<UserType> {
    const user = this.usersService.getUser(getUserInput);
    return user;
  }
}
