import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';
import { AuthResolver } from './auth.resolver';
import { BCryptHashProvider } from '../shared/providers/hash/provider/bcrypt-hash.provider';
import { RolesGuard } from './guards/roles.guard';
import { UsersModule } from '../users/users.module';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    RolesGuard,
    { provide: 'HashProvider', useClass: BCryptHashProvider },
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
