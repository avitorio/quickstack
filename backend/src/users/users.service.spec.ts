import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { BCryptHashProvider } from '../shared/providers/hash/provider/bcrypt-hash.provider';
import { User } from './user.entity';

const mockUser = new User();

const mockCredentialsDto = {
  email: 'test@email.com',
  password: 'TestPassword',
};

const mockUserRepository = () => ({
  findOne: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
});

describe('UserRepository', () => {
  let userRepository;
  let usersService: UsersService;
  let hashProvider: BCryptHashProvider;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: 'HashProvider', useClass: BCryptHashProvider },
      ],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
    usersService = await module.get<UsersService>(UsersService);
    hashProvider = await module.get<BCryptHashProvider>('HashProvider');
  });

  describe('signUp', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create.mockReturnValue({ save });
    });

    it('successfully signs up the user', () => {
      save.mockResolvedValue(undefined);

      expect(usersService.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });

    it('throws a conflict exception as email already exists', async () => {
      save.mockRejectedValue({ code: '23505' });
      await expect(usersService.signUp(mockCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws a conflict exception as email alreadt exists', async () => {
      save.mockRejectedValue({ code: '123123' });
      await expect(usersService.signUp(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update user email and password', async () => {
      jest.spyOn(usersService, 'updateUser');

      userRepository.findByEmail = jest.fn().mockResolvedValue(false);
      hashProvider.compareHash = jest.fn().mockResolvedValue(true);
      userRepository.save = jest.fn().mockResolvedValue(true);
      jest.spyOn(hashProvider, 'generateHash');

      expect(usersService.updateUser).not.toHaveBeenCalled();

      await usersService.updateUser(
        {
          email: 'andre@vitorio.net',
          old_password: '123123',
          password: '123456',
        },
        mockUser,
      );

      expect(usersService.updateUser).toHaveBeenCalled();

      expect(hashProvider.generateHash).toHaveBeenCalled();

      expect(await hashProvider.compareHash(mockUser.password, '123456')).toBe(
        true,
      );
    });
    it('should update user email if old_password and password are empty', async () => {
      jest.spyOn(usersService, 'updateUser');

      userRepository.findByEmail = jest.fn().mockResolvedValue(false);
      userRepository.save = jest.fn().mockResolvedValue(true);
      jest.spyOn(hashProvider, 'generateHash');

      expect(usersService.updateUser).not.toHaveBeenCalled();

      await usersService.updateUser(
        {
          email: 'andre@vitorio.net',
        },
        mockUser,
      );

      expect(usersService.updateUser).toHaveBeenCalled();

      expect(hashProvider.generateHash).not.toHaveBeenCalled();
    });

    it('should not update user if email already exists', async () => {
      jest.spyOn(usersService, 'updateUser');

      mockUser.email = 'old@email.com';

      userRepository.findByEmail = jest.fn().mockResolvedValue(true);

      expect(usersService.updateUser).not.toHaveBeenCalled();

      await expect(
        usersService.updateUser(
          {
            email: 'new@email.com',
            old_password: '123123',
            password: '123456',
          },
          mockUser,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should not update user if old password does not match', async () => {
      jest.spyOn(usersService, 'updateUser');

      hashProvider.compareHash = jest.fn().mockResolvedValue(false);

      expect(usersService.updateUser).not.toHaveBeenCalled();

      await expect(
        usersService.updateUser(
          {
            email: 'andre@vitorio.net',
            old_password: '123123',
            password: '123123',
          },
          mockUser,
        ),
      ).rejects.toThrowError('Old password is incorrect.');
    });
  });
});
