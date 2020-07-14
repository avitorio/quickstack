import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from '../users/user.repository';
import { User } from '../users/user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validates and returns user based on JWT payload', async () => {
      const user = new User();
      user.email = 'TestUser';

      userRepository.findOne.mockResolvedValue(user);

      const result = await jwtStrategy.validate({ email: 'jon@doe.com' });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        email: 'jon@doe.com',
      });
      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception as user cannot be found', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(jwtStrategy.validate({ email: 'jon@doe.com' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
