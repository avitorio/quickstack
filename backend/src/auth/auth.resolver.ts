import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { ValidationPipe } from '@nestjs/common';
import { AuthCredentialsInput } from './dto/auth-credentials.input';
import { SessionType } from './session.type';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(returns => SessionType)
  signIn(
    @Args('authCredentialsInput', ValidationPipe)
    authCredentialsInput: AuthCredentialsInput,
  ): Promise<SessionType> {
    return this.authService.signIn(authCredentialsInput);
  }
}
