import {
  Logger,
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { differenceInHours } from 'date-fns';
import { UserRepository } from '../user.repository';
import { UserTokensRepository } from './user-tokens.repository';
import IHashProvider from '../../shared/providers/hash/models/hash-provider.interface';

interface IRequest {
  token: string;
  password: string;
}

@Injectable()
export class ResetPasswordService {
  private logger = new Logger('PasswordRecoveryEmail');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(UserTokensRepository)
    private userTokensRepository: UserTokensRepository,

    @Inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({ token, password }: IRequest): Promise<boolean> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: "Token doesn't exist or is invalid.",
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = await this.userRepository.findOne(userToken?.user);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'User does not exist.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const tokenCreatedAt = userToken.created_at;

    if (differenceInHours(Date.now(), tokenCreatedAt) > 2) {
      await this.userTokensRepository.delete(userToken.id);
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Token has expired',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.save(user);

    await this.userTokensRepository.delete(userToken.id);

    return true;
  }
}
