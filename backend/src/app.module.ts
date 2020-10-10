import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfig } from './config/mailer.config';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

@Module({
  imports: [
    MailerModule.forRoot(MailerConfig),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({ req }),
      debug: false,
      formatError: (error: GraphQLError) => {
        console.log(error.extensions.exception.response);
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.extensions.exception.response.message || error.message,
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
