import { Test } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { ResetPasswordService } from './reset-password.service';
import { uuid } from 'uuidv4';
import { BCryptHashProvider } from '../../shared/providers/hash/provider/bcrypt-hash.provider';
import { UserTokensRepositoryFake } from './user-tokens.repository.fake';
import { UserTokensRepository } from './user-tokens.repository';
import { MailerService } from '@nestjs-modules/mailer';

const mockUserRepository = () => ({
  signUp: jest.fn((id, email, password) => {
    return { id, email, password };
  }),
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});

const mockMailerService = async () => ({
  sendMail: jest.fn(async () => {
    return true;
  }),
});

let userRepository: UserRepository;
let resetPasswordService: ResetPasswordService;
let userTokensRepository: UserTokensRepository;

describe('ResetPasswordService', () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResetPasswordService,
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: UserRepository, useFactory: mockUserRepository },
        { provide: MailerService, useFactory: mockMailerService },
        { provide: UserTokensRepository, useClass: UserTokensRepositoryFake },
        { provide: 'HashProvider', useClass: BCryptHashProvider },
      ],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);

    resetPasswordService = await module.get<ResetPasswordService>(
      ResetPasswordService,
    );

    userTokensRepository = await module.get<UserTokensRepository>(
      UserTokensRepository,
    );
  });

  it('should be able to reset the password', async () => {
    userRepository.findOne = jest.fn().mockResolvedValue({
      id: uuid(),
      email: 'johndoe@example.com',
      password: '123123',
    });

    userRepository.save = jest.fn();
    userTokensRepository.delete = jest.fn();

    jest.spyOn(userTokensRepository, 'generate');

    const { token } = await userTokensRepository.generate(
      'johndoe@example.com',
    );

    await resetPasswordService.execute({
      password: '123456',
      token,
    });

    userRepository.findOne = jest.fn().mockResolvedValue({
      id: uuid(),
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await userRepository.findOne('johndoe@example.com');

    expect(userTokensRepository.generate).toHaveBeenCalled();
    expect(updatedUser?.password).toBe('123456');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    expect(
      resetPasswordService.execute({
        token: 'non-existing',
        password: '123456',
      }),
    ).rejects.toThrowError("Token doesn't exist or is invalid.");
  });

  it('should not be able to reset the password with non-existing user', async () => {
    userTokensRepository.findByToken = jest.fn().mockResolvedValue(true);

    expect(
      resetPasswordService.execute({
        token: 'non-existing',
        password: '123456',
      }),
    ).rejects.toThrowError('User does not exist');
  });

  it('should not be able to reset the password after 2 hours', async () => {
    userRepository.findOne = jest.fn().mockResolvedValue({
      id: uuid(),
      email: 'johndoe@example.com',
      password: '123123',
    });

    userTokensRepository.delete = jest.fn();

    const { token } = await userTokensRepository.generate(
      'johndoe@example.com',
    );

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        password: '123456',
        token,
      }),
    ).rejects.toThrowError('Token has expired');
  });
});
