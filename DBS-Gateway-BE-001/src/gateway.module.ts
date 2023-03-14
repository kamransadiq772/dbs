import {
  Module,
  Inject,
  OnApplicationBootstrap,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthController } from './controllers/auth.controller';
import { IndividualController } from './controllers/individual.controller';
import { CompanyController } from './controllers/company.controller';
import { RoleController } from './controllers/role.controller';
import { ApplicationController } from './controllers/application.controller';
import { PermissionController } from './controllers/permission.controller';
import { ResponseService } from './services/response.service';

import {
  ClientProxyFactory,
  ClientRMQ,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { SERVICE } from './constants';
import { AuthNGuard } from './shared/guards/authN.guard';
import { AuthZGuard } from './shared/guards/authZ.guard';
import { SwaggerService } from './shared/swagger.service';
import { ExceptionsFilter } from './shared/filters/exceptions.filter';
import { WinstonModule } from 'nest-winston';
import { WinstonService } from './shared/config/winston.service';
import { LoggerMiddleware } from './shared/middleware/logger.middleware';
import { firstValueFrom } from 'rxjs';
// import { ReferenceService } from './services/reference.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './controllers/admin.controller';
import { UserAccountController } from './controllers/user-account.controller';
import { ProfilePicController } from './controllers/profile.pic.controller';
import { CityService } from './services/cites.services';
import { CitySchema } from './interfaces/cites.interfaces';

const schemaObject = {
  NODE_ENV: Joi.string().allow('development', 'production').required(),
  GATEWAY_BASE_URI: Joi.string().required(),
  GATEWAY_PORT: Joi.number().required(),
  RMQ_URI: Joi.string().required(),
  CLOUDWATCH_GROUP_NAME: Joi.string().optional(),
  CLOUDWATCH_STREAM_NAME: Joi.string().optional(),
  CLOUDWATCH_AWS_REGION: Joi.string().optional(),
  CLOUDWATCH_AWS_ACCESS_KEY: Joi.string().optional(),
  CLOUDWATCH_AWS_SECRET_KEY: Joi.string().optional(),
  CLOUDWATCH_LOGS: Joi.boolean().optional(),
};

Object.values(SERVICE).forEach((SERVICE_NAME) => {
  schemaObject[`RMQ_${SERVICE_NAME}_QUEUE`] = Joi.string().required();
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object(schemaObject),
      envFilePath: './.env',
    }),
    WinstonModule.forRootAsync({
      useClass: WinstonService,
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: `${config.get('MONGO_DSN')}/${config.get('MONGO_DATABASE')}`,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Cities', schema: CitySchema },
    ])
  ],
  controllers: [
    AuthController,
    IndividualController,
    CompanyController,
    RoleController,
    PermissionController,
    ApplicationController,
    UserAccountController,
    AdminController,
    ProfilePicController,
  ],
  providers: [
    // ReferenceService,
    ResponseService,
    CityService,
    { provide: APP_GUARD, useClass: AuthNGuard },
    { provide: APP_GUARD, useClass: AuthZGuard },
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    ...Object.values(SERVICE).map((SERVICE_NAME) => {
      return {
        provide: SERVICE_NAME,
        useFactory: (config: ConfigService) => {
          console.log(config.get(`RMQ_${SERVICE_NAME}_QUEUE`));
          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [config.get<string>('RMQ_URI')],
              queue: config.get(`RMQ_${SERVICE_NAME}_QUEUE`),
              queueOptions: {
                durable: false,
              },
            },
          });
        },
        inject: [ConfigService],
      };
    }),
  ],
})
export class GatewayModule implements NestModule {
  constructor(private config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    if (
      this.config.get('NODE_ENV') == 'production' &&
      this.config.get('CLOUDWATCH_LOGS') == 'true'
    ) {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
}
