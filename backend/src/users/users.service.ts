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
import { CreateUserInput } from './dto/create-user.input';
import IHashProvider from '../shared/providers/hash/models/hash-provider.interface';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';
import { UserRole } from './user.type';
import { GetUserInput } from './dto/get-user.input';

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
    const firstUser = await this.userRepository.findOne();

    const { email, password } = createUserInput;

    const user = await this.userRepository.create();

    user.email = email;
    user.password = await this.hashProvider.generateHash(password);
    user.role = firstUser ? UserRole.MEMBER : UserRole.ADMIN;

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
    const { id, email, old_password, password } = updateUserInput;

    const isAdmin = user.role === UserRole.ADMIN;

    if (isAdmin) {
      user = await this.userRepository.findOne(id);
    }

    if (email !== user.email) {
      const emailExists = await this.userRepository.findByEmail(email);

      if (emailExists) {
        throw new ConflictException('Email is already used.');
      }
    }

    if (password && !old_password && !isAdmin) {
      throw new Error('Old password required to set a new password.');
    }

    if (password && (old_password || isAdmin)) {
      if (!isAdmin) {
        const oldPasswordMatches = await this.hashProvider.compareHash(
          old_password,
          user.password,
        );

        if (!oldPasswordMatches && !isAdmin) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              message: 'Old password is incorrect.',
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    user.email = email;

    await this.userRepository.save(user);

    return true;
  }

  async getUser(getUserInput: GetUserInput): Promise<User> {
    const { id } = getUserInput;
    const user = await this.userRepository.findOne(id);
    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.getUsers();
    return users;
  }
}
