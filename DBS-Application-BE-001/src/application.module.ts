import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { SERVICE } from './constants';
import { ApplicationService } from './services/application.service';
import { ApplicationController } from './controllers/application.controller';
import { Model } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './schemas/application.schema';
//import { Permission, PermissionSchema } from './schemas/permission.schema';
import { AppHist, AppHistSchema } from './schemas/applicationHist.schema';
import { ApplicationRepository } from './repositories/application.repository';
import { CommitSchema } from './schemas/commit-appliction.schema';
import { CommitRepository } from './repositories/commit-application.repository';
import { Permission, PermissionSchema } from './schemas/permission.schema';

const schemaObject = {
  RMQ_URI: Joi.string().required(),
  COGNITO_USERPOOL_ID: Joi.string().required(),
  COGNITO_CLIENT_ID: Joi.string().required(),
  COGNITO_CLIENT_SECRET: Joi.string().required(),
  COGNITO_REGION: Joi.string().required(),
  MONGO_DSN: Joi.string().required(),
  MONGO_DATABASE: Joi.string().required(),
};
schemaObject[`RMQ_${SERVICE}_QUEUE`] = Joi.string().required();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object(schemaObject),
      envFilePath: './.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: `${config.get('MONGO_DSN')}/${config.get('MONGO_DATABASE')}`,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: 'commit', schema: CommitSchema },
      { name: 'apphist', schema: AppHistSchema },
    ]),
  ],
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    ApplicationRepository,
    CommitRepository,
    // {
    //   provide: 'CognitoIDP',
    //   useFactory: () =>
    //     new CognitoIdentityServiceProvider({
    //       region: process.env.COGNITO_REGION,
    //       accessKeyId: process.env?.COGNITO_AWS_ACCESS_KEY,
    //       secretAccessKey: process.env?.COGNITO_AWS_SECRET_KEY,
    //     }),
    // },
    {
      provide: 'CognitoIDP',
      useFactory: () =>
        new CognitoIdentityServiceProvider({
          region: process.env.COGNITO_REGION,
          accessKeyId: process.env?.COGNITO_AWS_ACCESS_KEY,
          secretAccessKey: process.env?.COGNITO_AWS_SECRET_KEY,
        }),
    },
  ],
})
export class ApplicationModule {}
