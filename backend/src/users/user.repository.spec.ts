import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('findByEmail', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.email = 'test@email.com';
    });

    it('should find a user by email', async () => {
      userRepository.findOne.mockResolvedValue(user);

      const result = await userRepository.findByEmail('test@email.com');

      expect(result?.email).toEqual('test@email.com');
    });

    it('should return null as user is not found', async () => {
      userRepository.findOne.mockResolvedValue(undefined);

      const result = await userRepository.findByEmail('test@email.com');

      expect(result).toEqual(null);
    });
  });
});
