import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { ValidationPipe } from '@nestjs/common';
import { ResetPasswordInput } from './dto/reset-password.input';
import { ResetPasswordService } from './reset-password.service';

@Resolver()
export class ResetPasswordResolver {
  constructor(private resetPasswordService: ResetPasswordService) {}

  @Mutation(returns => Boolean)
  resetPassword(
    @Args('resetPasswordInput', ValidationPipe)
    resetPasswordInput: ResetPasswordInput,
  ): Promise<boolean> {
    return this.resetPasswordService.execute(resetPasswordInput);
  }
}
