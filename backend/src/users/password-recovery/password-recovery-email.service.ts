import { Logger, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user.repository';
import { UserTokensRepository } from './user-tokens.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { resolve } from 'path';

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
    private readonly mailerService: MailerService
  ) {}

  async execute({ email }: IRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User does not exist');
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    await this
      .mailerService
      .sendMail({
        to: email,
        subject: 'Your password recovery request',
        template: resolve(__dirname, 'views', 'password-recovery-email.hbs'),
        context: { 
          token
        },
      })
      .then(() => {
        this.logger.log(`Password recovery email sent to ${email}`);
      })
      .catch((err) => {
        this.logger.error(`Password recovery email not sent to ${email} with error: ${err}`);
      });
  }
}