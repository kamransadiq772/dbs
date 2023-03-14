import {
  Controller,
  Get,
  Inject,
  Query,
  Logger,
  UseInterceptors,
  Body,
  Post,
  Req,
  Patch,
} from '@nestjs/common';
import { ClientRMQ, RpcException } from '@nestjs/microservices';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SERVICE } from '../constants';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ApiDescription } from '../shared/decorators/custom';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { SignUpRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { CreateAdminUserRequestDto } from '../dto/admin/admin-user.dto';
import { firstValueFrom } from 'rxjs';
import { IUser } from '../interfaces/admin/create.user.interface';
import { AuthN } from '../shared/decorators/authN.decorator';
import { SignInTempPassRequestDto } from '../dto/auth/SignInTempPass.dto';
import { SigninIndividualRequestDto, SigninUserRequestDto } from '../dto/auth';
import { UpdateAdminUserRequestDto } from '../dto/admin/admin-user-profile-update.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    //  @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @Inject(SERVICE.USER_ACCOUNT) private USER_ACCOUNTS: ClientRMQ,
    @Inject(SERVICE.USER_PROFILE) private USER_PROFILES: ClientRMQ,
  ) {}

  @Post('createUser')
  @AuthN()
  async createuser(
    @Body() dto: CreateAdminUserRequestDto,
    @Req() { user: { userId, roles } },
  ) {
    try {
      const { AllUser, UserDetails, ApplicantBasic, defaultRole } = dto;
      const { email } = AllUser;
      console.log('company', userId, roles[0]);

      // if (!roles) {
      //    return {
      //       message:
      //         'User signed up Un successfully',
      //     };
      // } else {
      // console.log("newwwwwwe",dto,"");
      // console.log("newwwwwwe",email,"");

      let shortName;

      if (roles[0] === 'COMPANY_ADMIN') {
        var response = await firstValueFrom(
          this.USER_PROFILES.send('get_company', { userId }),
        );
        shortName = response.shortName;
      } else {
        var response = await firstValueFrom(
          this.USER_PROFILES.send('get_company_short_name', { userId }),
        );
        shortName = response.data.shortCompanyName;
      }

      console.log(response, 'response');

      console.log(shortName, 'shortName');

      const signUp = await firstValueFrom(
        this.USER_ACCOUNTS.send('create_user_admin', {
          email,
          defaultRole,
          shortName,
        }),
      );
      await firstValueFrom(
        this.USER_PROFILES.send('create_user_db', {
          CreatedBy: userId,
          createdByRole: roles,
          userId: signUp.userId,
          UserDetails,
          AllUser,
          ApplicantBasic,
          defaultRole,
        }),
      );
      await firstValueFrom(
        this.USER_ACCOUNTS.send('admin_assign_role', {
          userId: signUp.userId,
          role: defaultRole,
        }),
      );
      return signUp;
      // }
    } catch (err) {
      throw err;
    }

    //   @Post('/change_temp_password_company')
    //   async signinTempComapny(@Body() dto: ) {
    //     return this.authClient.send('change-temp-password', dto);
  }
  /*********************************************Sign-In__With-Temp_Individual **************************************************/

  @Post('/change_temp_password')
  async signinTemp(@Body() dto: SignInTempPassRequestDto) {
    console.log('----======');
    return this.USER_ACCOUNTS.send('change-temp-password', dto);
  }

  /*********************************************Sign-In__Individual **************************************************/

  @Post('/signin')
  async signin(@Body() dto: SigninUserRequestDto) {
    const response = await firstValueFrom(
      this.USER_PROFILES.send('check_company_short_name', dto),
    );
    console.log(response);
    if (response.message === 'User_Not_Found') {
      throw new RpcException('Invalid User');
    }
    const reponse2 = await firstValueFrom(
      this.USER_ACCOUNTS.send('signin', dto),
    );
    return reponse2;
  }
  /*********************************************get_user_profile **************************************************/

  @Get('getUserProfile')
  @AuthN()
  async get(@Req() req) {
    const userprofileId = req.user.userId;
    return this.USER_PROFILES.send('get_user_profile', {
      userId: userprofileId,
    });
  }

  /*********************************************update_user **************************************************/

  @Patch('updateUserProfile')
  @AuthN()
  async update(@Req() req, @Body() dto: UpdateAdminUserRequestDto) {
    const userProfileUpdate = req.user.userId;
    dto.userId = userProfileUpdate;
    return this.USER_PROFILES.send('update_user', dto);
  }
}
