import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { ValidationPipe } from '@nestjs/common';
import { PasswordRecoveryEmailService } from './password-recovery-email.service';
import { PasswordRecoveryEmailInput } from './dto/password-recovery-email.input';

@Resolver()
export class PasswordRecoveryEmailResolver {
  constructor(
    private passwordRecoveryEmailService: PasswordRecoveryEmailService,
  ) {}

  @Mutation(returns => Boolean)
  passwordRecoveryEmail(
    @Args('passwordRecoveryEmailInput', ValidationPipe)
    passwordRecoveryEmailInput: PasswordRecoveryEmailInput,
  ): boolean {
    console.log(passwordRecoveryEmailInput);
    this.passwordRecoveryEmailService.execute(passwordRecoveryEmailInput);

    return true;
  }
}
