import { MailerOptions } from '@nestjs-modules/mailer';
import * as config from 'config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

const mailerConfig = config.get('mail');

export const MailerConfig: MailerOptions = {
  transport: {
    host: mailerConfig.host,
    port: mailerConfig.port,
    auth: {
      user: mailerConfig.user,
      pass: mailerConfig.pass,
    }
  },
  defaults: {
    from: mailerConfig.from
  },
  template: {
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
}