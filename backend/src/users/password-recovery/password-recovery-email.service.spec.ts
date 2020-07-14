import { Test } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { PasswordRecoveryEmailService } from './password-recovery-email.service';
import { UserTokensRepository } from './user-tokens.repository';
import { UsersService } from '../users.service';
import { UserTokensRepositoryFake } from './user-tokens.repository.fake';
import { MailerService } from '@nestjs-modules/mailer';

const mockUser = { email: 'johndoe@example.com', password: '123123' };

const mockUserRepository = () => ({
  create: jest.fn(),
  findByEmail: jest.fn(),
});

const mockUsersService = () => ({
  signUp: jest.fn(),
});

const mockMailerService = async () => ({
  sendMail: jest.fn(async () => {
    return true;
  }),
});

let userRepository: UserRepository;
let passwordRecoveryEmailService: PasswordRecoveryEmailService;
let userTokensRepository: UserTokensRepository;
let usersService: UsersService;

describe('PasswordRecoveryEmail', () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PasswordRecoveryEmailService,
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: MailerService, useFactory: mockMailerService },
        { provide: UserTokensRepository, useClass: UserTokensRepositoryFake },
        { provide: UsersService, useFactory: mockUsersService },
      ],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
    usersService = await module.get<UsersService>(UsersService);

    passwordRecoveryEmailService = await module.get<
      PasswordRecoveryEmailService
    >(PasswordRecoveryEmailService);

    userTokensRepository = await module.get<UserTokensRepository>(
      UserTokensRepository,
    );
    
  });

  it('should be able to recover the password by email', async () => {
    userRepository.findByEmail = jest
      .fn()
      .mockResolvedValue({ email: 'johndoe@example.com' });

    userTokensRepository;

    jest.spyOn(passwordRecoveryEmailService, 'execute');

    await passwordRecoveryEmailService.execute({
      email: 'johndoe@example.com',
    });

    expect(passwordRecoveryEmailService.execute).toHaveBeenCalledWith({
      email: 'johndoe@example.com',
    });
  });

  it('should not send password recovery email to non-existent users', async () => {
    userRepository.findByEmail = jest.fn().mockResolvedValue(undefined);

    await expect(async () => {
      await passwordRecoveryEmailService.execute({
        email: 'jonasdoe@example.com',
      });
    }).rejects.toEqual(new Error('User does not exist'));
  });

  it('should generate a forgot password token', async () => {
    userRepository.findByEmail = jest
      .fn()
      .mockResolvedValue({ email: 'johndoe@example.com' });

    await usersService.signUp(mockUser);

    jest.spyOn(passwordRecoveryEmailService, 'execute');
    jest.spyOn(userTokensRepository, 'generate');

    await passwordRecoveryEmailService.execute({
      email: 'johndoe@example.com',
    });

    expect(userTokensRepository.generate).toHaveBeenCalled();
  });
});
