import {
  Logger,
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user.repository';
import { UserTokensRepository } from './user-tokens.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { resolve } from 'path';
import * as config from 'config';

const appConfig = config.get('app');

interface IRequest {
  email: string;
}

@Injectable()
export class PasswordRecoveryEmailService {
  private logger = new Logger('PasswordRecoveryEmail');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(UserTokensRepository)
    private userTokensRepository: UserTokensRepository,

    @Inject(MailerService)
    private readonly mailerService: MailerService,
  ) {}

  async execute({ email }: IRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'User does not exist.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Your password recovery request',
        template: resolve(__dirname, 'views', 'password-recovery-email.hbs'),
        context: {
          token,
          appUrl: `${process.env.FRONTEND_URL || appConfig.frontend}/reset-password`,
        },
      })
      .then(() => {
        this.logger.log(`Password recovery email sent to ${email}`);
      })
      .catch(err => {
        this.logger.error(
          `Password recovery email not sent to ${email} with error: ${err}`,
        );
      });
  }
}
