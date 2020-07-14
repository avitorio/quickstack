import { Resolver, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { ValidationPipe } from '@nestjs/common';
import { AuthCredentialsInput } from './dto/auth-credentials.input';
import { SessionType } from './session.type';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(returns => SessionType)
  singIn(
    @Args('authCredentialsInput', ValidationPipe)
    authCredentialsInput: AuthCredentialsInput,
  ): Promise<SessionType> {
    return this.authService.signIn(authCredentialsInput);
  }
}
