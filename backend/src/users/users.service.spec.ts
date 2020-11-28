import { Test } from '@nestjs/testing';
import {
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import { UserRepository } from './user.repository';
import { UsersService } from './users.service';
import { BCryptHashProvider } from '../shared/providers/hash/provider/bcrypt-hash.provider';
import { User } from './user.entity';
import { UserRole } from './user-role.type';

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

    it('successfully signs up first user as an admin', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);

      save.mockResolvedValue(undefined);

      mockUser.save = save;

      userRepository.create.mockResolvedValue(mockUser);

      await expect(
        usersService.signUp(mockCredentialsDto),
      ).resolves.not.toThrow();
      expect(mockUser.role).toBe('admin');
    });

    it('successfully sign up subsequent user roles as member', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      save.mockResolvedValue(undefined);

      mockUser.save = save;

      userRepository.create.mockResolvedValue(mockUser);

      await expect(
        usersService.signUp(mockCredentialsDto),
      ).resolves.not.toThrow();
      expect(mockUser.role).toBe('member');
    });

    it('throws a conflict exception as email already exists', async () => {
      save.mockRejectedValue({ code: '23505' });
      await expect(usersService.signUp(mockCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws internal server error if response differs from 23505', async () => {
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
          email: 'user@email.com',
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
          email: 'user@email.com',
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
            email: 'user@email.com',
            old_password: '123123',
            password: '123123',
          },
          mockUser,
        ),
      ).rejects.toThrowError('Old password is incorrect.');
    });

    it('should not update user if old password missing', async () => {
      jest.spyOn(usersService, 'updateUser');

      expect(usersService.updateUser).not.toHaveBeenCalled();

      await expect(
        usersService.updateUser(
          {
            email: 'user@email.com',
            password: '123123',
          },
          mockUser,
        ),
      ).rejects.toThrowError('Old password required to set a new password.');
    });

    it('should allow admin to update user email if password is empty', async () => {
      jest.spyOn(usersService, 'updateUser');

      mockUser.email = 'admin@email.com';
      mockUser.role = UserRole.ADMIN;

      userRepository.findOne = jest.fn().mockResolvedValue({
        id: 'askdmasdmasdkmasd',
        email: 'user@email.com',
      });
      
      userRepository.findByEmail = jest.fn().mockResolvedValue(false);
      userRepository.save = jest.fn().mockResolvedValue(true);
      jest.spyOn(hashProvider, 'generateHash');

      expect(usersService.updateUser).not.toHaveBeenCalled();

      await usersService.updateUser(
        {
          id: 'askdmasdmasdkmasd',
          email: 'updated@email.com',
        },
        mockUser,
      );

      expect(usersService.updateUser).toHaveBeenCalled();

      expect(hashProvider.generateHash).not.toHaveBeenCalled();
    });

    it('should allow admin to update user password', async () => {
      jest.spyOn(usersService, 'updateUser');

      mockUser.email = 'admin@email.com';
      mockUser.role = UserRole.ADMIN;

      userRepository.findOne = jest.fn().mockResolvedValue({
        id: 'askdmasdmasdkmasd',
        email: 'user@email.com',
      });
      
      userRepository.findByEmail = jest.fn().mockResolvedValue(false);
      userRepository.save = jest.fn().mockResolvedValue(true);
      jest.spyOn(hashProvider, 'generateHash');

      expect(usersService.updateUser).not.toHaveBeenCalled();

      await usersService.updateUser(
        {
          id: 'askdmasdmasdkmasd',
          email: 'updated@email.com',
          password: '123123'
        },
        mockUser,
      );

      expect(usersService.updateUser).toHaveBeenCalled();

      expect(hashProvider.generateHash).toHaveBeenCalled();
    });

    it('should allow admin to update user role', async () => {
      jest.spyOn(usersService, 'updateUser');

      mockUser.email = 'admin@email.com';
      mockUser.role = UserRole.ADMIN;

      userRepository.findOne = jest.fn().mockResolvedValue({
        id: 'askdmasdmasdkmasd',
        email: 'user@email.com',
        role: UserRole.MEMBER
      });
      
      userRepository.findByEmail = jest.fn().mockResolvedValue(false);
      userRepository.save = jest.fn().mockResolvedValue(true);

      expect(usersService.updateUser).not.toHaveBeenCalled();

      await usersService.updateUser(
        {
          id: 'askdmasdmasdkmasd',
          email: 'updated@email.com',
          role: UserRole.ADMIN
        },
        mockUser,
      );

      expect(usersService.updateUser).toHaveBeenCalled();

      expect(userRepository.save).toHaveBeenCalledWith({
        id: 'askdmasdmasdkmasd',
        email: 'updated@email.com',
        role: UserRole.ADMIN
      });
    });

    it('should not allow member to update user role', async () => {
      jest.spyOn(usersService, 'updateUser');

      mockUser.email = 'admin@email.com';
      mockUser.role = UserRole.MEMBER;

      await expect(
        usersService.updateUser(
          {
            id: 'askdmasdmasdkmasd',
          email: 'updated@email.com',
          role: UserRole.ADMIN
          },
          mockUser,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getUsers', () => {
    it('should list all users', async () => {
      jest.spyOn(usersService, 'getUsers');

      const user = new User();
      const user2 = new User();

      user.email = 'test@email.com';
      user2.email = 'test2@email.com';

      userRepository.getUsers = jest.fn().mockResolvedValue([user, user2]);

      await usersService.getUsers();

      expect(userRepository.getUsers).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should get one user by id', async () => {
      jest.spyOn(usersService, 'getUser');

      const user = new User();

      user.id = 'adononononono';
      user.email = 'test@email.com';

      userRepository.findOne = jest.fn().mockResolvedValue([user]);

      await usersService.getUser({ id: user.id });

      expect(userRepository.findOne).toHaveBeenCalled();
    });
  });
});
