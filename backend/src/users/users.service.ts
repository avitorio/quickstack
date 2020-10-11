import {
  Injectable,
  Logger,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserInputError } from 'apollo-server-express';
import { CreateUserInput } from './dto/create-user.input';
import IHashProvider from '../shared/providers/hash/models/hash-provider.interface';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @Inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async signUp(createUserInput: CreateUserInput): Promise<boolean> {
    const { email, password } = createUserInput;

    const user = await this.userRepository.create();

    user.email = email;
    user.password = await this.hashProvider.generateHash(password);

    try {
      await user.save();
      return true;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateUser(
    updateUserInput: UpdateUserInput,
    user: User,
  ): Promise<boolean> {
    const { email, old_password, password } = updateUserInput;

    if (email !== user.email) {
      const emailExists = await this.userRepository.findByEmail(email);

      if (emailExists) {
        throw new ConflictException('Email is already used.');
      }
    }

    if (password && !old_password) {
      throw new Error('Old password required to set a new password.');
    }

    const oldPasswordMatches = await this.hashProvider.compareHash(
      old_password,
      user.password,
    );

    if (!oldPasswordMatches) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: ['Old password is incorrect.'],
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    user.email = email;
    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.save(user);

    return true;
  }
}
