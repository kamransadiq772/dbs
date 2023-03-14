import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { SERVICE } from './constants';
import { RoleService } from './services/role.service';
import { UserPermissionService } from "./services/user-permission.service"
import { AuthController } from './controllers/auth.controller';
import { TokenController } from './controllers/token.controller';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
import { UserPermissionController } from "./controllers/user-permission.controller"
import { PermissionService } from './services/permission.service';
import { PermissionRepository } from './repositories/permission.repository';
import { UserPermissionRepository } from './repositories/user-permission.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './schemas/permission.schema';
import { UserPermission, UserPermissionSchema } from './schemas/user.permission.schema';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { RoleRepository } from './repositories/role.repository';
import { Role, RoleSchema } from './schemas/role.schema';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { User, UserSchema } from './schemas/user.schema';
// import { UserPermission, UserPermissionSchema } from './schemas/userpermission.schema';

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
    ]),

    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
    ]),

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),

    MongooseModule.forFeature([
      { name: UserPermission.name, schema: UserPermissionSchema },
    ])
  ],
  controllers: [
    AuthController,
    TokenController,
    RoleController,
    PermissionController,
    AdminController,
    UserController,
    UserPermissionController
  ],
  providers: [
    AuthService,
    TokenService,
    RoleService,
    PermissionService,
    AdminService,
    UserPermissionService,
    PermissionRepository,
    UserPermissionRepository,
    RoleRepository,
    UserRepository,
    UserService,
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
export class UserAccountModule { }
