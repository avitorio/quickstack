import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PasswordRecoveryEmailService } from './password-recovery/password-recovery-email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserTokensRepository } from './password-recovery/user-tokens.repository';
import { UsersResolver } from './users.resolver';
import { BCryptHashProvider } from '../shared/providers/hash/provider/bcrypt-hash.provider';
import { ResetPasswordResolver } from './password-recovery/reset-password.resolver';
import { PasswordRecoveryEmailResolver } from './password-recovery/password-recovery-email.resolver';
import { ResetPasswordService } from './password-recovery/reset-password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([UserTokensRepository]),
  ],
  providers: [
    UsersResolver,
    UsersService,
    PasswordRecoveryEmailService,
    { provide: 'HashProvider', useClass: BCryptHashProvider },
    ResetPasswordResolver,
    ResetPasswordService,
    PasswordRecoveryEmailResolver,
    PasswordRecoveryEmailService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
