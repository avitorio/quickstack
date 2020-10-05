import { Test } from '@nestjs/testing';
import { UserRepository } from '../users/user.repository';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { BCryptHashProvider } from '../shared/providers/hash/provider/bcrypt-hash.provider';
import IHashProvider from '../shared/providers/hash/models/hash-provider.interface';
import { AuthService } from './auth.service';

const jwtConfig = config.get('jwt');

const mockCredentialsDto = {
  email: 'test@email.com',
  password: '123456',
};

describe('AuthService', () => {
  let userRepository;
  let authService: AuthService;
  let hashProvider: IHashProvider;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET || jwtConfig.secret,
          signOptions: {
            expiresIn: jwtConfig.expiresIn,
          },
        }),
      ],
      providers: [
        UsersService,
        UserRepository,
        AuthService,
        { provide: 'HashProvider', useClass: BCryptHashProvider },
      ],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
    hashProvider = await module.get<IHashProvider>('HashProvider');
    authService = await module.get<AuthService>(AuthService);
  });

  describe('validateUserPassword', () => {
    let user;

    beforeEach(async () => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.email = 'test@email.com';
      user.password = await hashProvider.generateHash('123456');
      user.validatePassword = jest.fn();
    });

    it('returns Jwt token as validation is successful', async () => {
      userRepository.findOne.mockResolvedValue(user);

      const { token } = await authService.signIn(mockCredentialsDto);

      const tokenParts = token.split('.');

      expect(tokenParts.length).toBe(3);
    });

    it('throws UnauthorizedException error as user is not found', async () => {
      userRepository.findOne.mockResolvedValue(undefined);

      await expect(
        authService.signIn({ email: 'this@test.com', password: '123123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException error as validation is unsuccessful', async () => {
      userRepository.findOne.mockResolvedValue(user);

      await expect(
        authService.signIn({ email: 'this@test.com', password: '123123' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
