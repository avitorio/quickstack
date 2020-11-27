import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { throwError } from 'rxjs';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('findByEmail', () => {
    let user;

    beforeEach(() => {
      user = new User();
      user.email = 'test@email.com';
    });

    it('should find a user by email', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(user);

      const result = await userRepository.findByEmail('test@email.com');

      expect(result?.email).toEqual('test@email.com');
    });

    it('should return null as user is not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(undefined);

      const result = await userRepository.findByEmail('test@email.com');

      expect(result).toEqual(null);
    });
  });

  describe('getUsers', () => {
    let user;

    beforeEach(() => {
      userRepository.find = jest.fn();
      user = new User();
      user.email = 'test@email.com';
    });

    it('should return an array with all users', async () => {
      userRepository.find = jest.fn().mockResolvedValue([user]);

      const result = await userRepository.getUsers();

      expect(result).toEqual([user]);
      expect(userRepository.find).toHaveBeenCalled();
    });

    it('should return an empty array as there are no users', async () => {
      userRepository.find = jest.fn().mockResolvedValue([]);

      const result = await userRepository.getUsers();

      expect(result).toEqual([]);
    });

    it('should return an empty array as an error is thrown', async () => {
      userRepository.find = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      const result = await userRepository.getUsers();

      expect(result).toEqual([]);
    });
  });
});
