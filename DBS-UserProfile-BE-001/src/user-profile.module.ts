import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { IndividualService } from './services/individual.service';
import { UserService } from './services/user.service';
import { CompanyService } from './services/company.service';
import { IndividualRepository } from './repositories/individual.repository';

import { UserPermissionRepository } from './repositories/user-permission.repository';
import { RoleRepository } from './repositories/role.repository';

import { UserRepository } from './repositories/user.repository';
import { CompanyRepository } from './repositories/company.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Individual, IndividualSchema } from './schemas/individual.schema';
import { Company, CompanySchema } from './schemas/company.schema';
//import { User, UserSchema } from './schemas/user.schema';
import { User, UserSchema } from './schemas/user.schema';
import { HttpModule} from '@nestjs/axios';
import { UserHistory, UserhistorySchema } from './schemas/userhistory.schema';

import {
  UserPermission,
  UserPermissionSchema,
} from './schemas/user.permission.schema';
import { Role, RoleSchema } from './schemas/role.schema';

import { SERVICE } from './constants';
import { IndividualController } from './controllers/individual.controller';
import { CompanyController } from './controllers/company.controller';
import { UserController } from './controllers/user.controller';
import { ProfilePic, ProfilePicSchema } from './schemas/profile.pic.schema';
import { ProfilePicController } from './controllers/profile.controller';
import { ProfilePicRepository } from './repositories/profile.pic.repository';
import { ProfilePicService } from './services/profile.pic.service';
 

const schemaObject = {
  RMQ_URI: Joi.string().required(),
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
      { name: Individual.name, schema: IndividualSchema },
      { name: Company.name, schema: CompanySchema },
      { name: User.name, schema: UserSchema },
      { name: UserPermission.name, schema: UserPermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: ProfilePic.name, schema: ProfilePicSchema },
      { name: UserHistory.name, schema: UserhistorySchema }, 
    ]),
    HttpModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        timeout: 5000,
        maxRedirects: 3,
        baseURL: config.get('CONTRACT_BOOK_URL'),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.get('CONTRACT_BOOK_API_KEY')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    IndividualController,
    CompanyController,
    UserController,
    ProfilePicController,
  ],
  providers: [
    IndividualService,
    IndividualRepository,
    CompanyService,
    CompanyRepository,
    UserRepository,
    UserService,
    UserPermissionRepository,
    RoleRepository,
    ProfilePicRepository,
    ProfilePicService,
  ],
})
export class UserProfileModule {}
