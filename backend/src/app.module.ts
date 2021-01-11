import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { MailerModule } from '@nestjs-modules/mailer';
import * as config from 'config';

import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailerConfig } from './config/mailer.config';
import beautifyError from './utils/beautifyError';

const appConfig = config.get('app');
const debug = process.env.NODE_ENV === 'development';

@Module({
  imports: [
    MailerModule.forRoot(MailerConfig),
    GraphQLModule.forRoot({
      cors: {
        origin: `${process.env.FRONTEND_URL || appConfig.frontend}`,
        credentials: true,
      },
      autoSchemaFile: true,
      context: ({ req }) => ({ req }),
      debug,
      formatError: (error: GraphQLError) => {
        if (debug) {
          const logger = new Logger('AppModule');
          logger.log(`GraphQLError: ${error}`);
        }

        const message = error.extensions.exception.response.message;

        // Check if error message comes as a string or an array
        const graphQLFormattedError: GraphQLFormattedError = {
          message: beautifyError(
            typeof message === 'string' ? message : message[0] || error.message,
          ),
        };

        return graphQLFormattedError;
      },
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TasksModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
