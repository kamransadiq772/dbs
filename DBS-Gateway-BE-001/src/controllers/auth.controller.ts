import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Logger,
  Req,
  Header,
  BadRequestException,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
// import { ApiDescription } from '../services/decorators/custom';
import { ClientRMQ, RpcException } from '@nestjs/microservices';
import { SERVICE } from '../constants';
import {
  SignOutRequestDto,
  SignupIndividualRequestDto,
  SignupIndividualResponsetDto,
  AssignRoleRequestDto,
  RemoveRoleRequestDto,
  VerifyEmailRequestDto,
  VerifyEmailResponseDto,
  SigninCompanyRequestDto,
  SigninIndividualRequestDto,
  SignupCompanyResponsetDto,
  SignupCompanyRequestDto,
  SigninIndividualResponseDto,
  SigninCompanyResponseDto,
} from '../dto/auth';
import { SignInTempPassRequestDto } from '../dto/auth/SignInTempPass.dto';
import { ChangePasswordDto } from '../dto/auth/change-password.dto';
import { ResendCodeDto } from '../dto/auth/resend_send.dto';
import { forgotPasswordDto } from '../dto/auth/forgot-password.dto';
import { catchError, first, firstValueFrom, tap } from 'rxjs';
import { confirmForgotPasswordDto } from '../dto/auth/confirmforgotpassword.dto';
import { ResponseService } from '../services/response.service';
import { SignInTempPassCompanyRequestDto } from '../dto/auth/SignInTempPassCompany.dto';

import { forgotPasswordCompanyDto } from '../dto/auth/forgotpasswordCompany.dto';
import { ChangePasswordCompanydDto } from '../dto/auth/changepasswordCompany.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject(SERVICE.USER_ACCOUNT) private authClient: ClientRMQ,
    @Inject(SERVICE.USER_PROFILE) private userClient: ClientRMQ,
    private readonly response: ResponseService,
  ) {}

  /*********************************************Sign-Up--Individual **************************************************/

  // @ApiDescription('Used to signup') 1
  @ApiCreatedResponse({
    type: SignupIndividualResponsetDto,
  })
  @Post('/signup/individual')
  async signupIndividual(@Body() dto: SignupIndividualRequestDto) {
    try {
      const { email, defaultRole, ...user } = dto;
      if (defaultRole !== 'INDIVIDUAL_USER') {
        throw new BadRequestException('Signup as INDIVIDUAL_USER');
      }
      console.log(email, defaultRole);
      const signupResponse = await firstValueFrom(
        this.authClient.send('signup', { email, defaultRole }),
      );
      await firstValueFrom(
        this.userClient.send('create_individual', {
          userId: signupResponse.userId,
          email,
          ...user,
        }),
      );
      await firstValueFrom(
        this.authClient.send('admin_assign_role', {
          userId: signupResponse.userId,
          role: defaultRole,
        }),
      );
      await firstValueFrom(
        this.authClient.send('create_user_permission', {
          userId: signupResponse.userId,
          role: defaultRole,
        }),
      );
      // this.logger.log('info', user);
      this.logger.log('info');
      return signupResponse;
    } catch (err) {
      throw err;
    }
  }

  /*********************************************Sign-Up--Company **************************************************/

  @ApiCreatedResponse({
    type: SignupCompanyResponsetDto,
  })
  @Post('/signup/company')
  async signupCompany(@Body() dto: SignupCompanyRequestDto) {
    try {
      const {
        companyDetails,
        yourDetails,
        companyAdminUser,
        companyPreferences,
        defaultRole,
      } = dto;
      const { shortName, ...user } = companyDetails;

      const { adminUser } = yourDetails;

      let email;

      if (adminUser === false) {
        email = companyDetails.email;
      } else {
        email = companyAdminUser.email;
      }

      const signupResponse = await firstValueFrom(
        this.authClient.send('signup', { email, defaultRole, shortName }),
      );

      console.log(signupResponse);

      await firstValueFrom(
        this.userClient.send('create_company', {
          userId: signupResponse.userId,
          companyDetails,
          yourDetails,
          companyAdminUser,
          companyPreferences,
          defaultRole,
        }),
      );
      await firstValueFrom(
        this.authClient.send('admin_assign_role', {
          userId: signupResponse.userId,
          role: defaultRole,
        }),
      ),
        await firstValueFrom(
          this.authClient.send('create_user_permission', {
            userId: signupResponse.userId,
            role: defaultRole,
          }),
        );
      this.logger.log('info', user);
      return signupResponse;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /*********************************************Verfiy-Email **************************************************/

  @Get('/verify-email')
  async verifyEmail(@Query() query: VerifyEmailRequestDto) {
    return this.authClient.send('verify_email', query);
  }

  /*********************************************Sign-In__With-Temp_Comapny**************************************************/

  @Post('/change_temp_password_company')
  async signinTempComapny(@Body() dto: SignInTempPassCompanyRequestDto) {
    try {
      const { shortCompanyName } = dto;
      console.log(shortCompanyName);
      // const res = await firstValueFrom(
      //   this.userClient.send('check_company', dto),
      // );
      const signInResponse = await firstValueFrom(
        this.authClient.send('change-temp-password', dto),
      );
      const tokenVerify = await firstValueFrom(
        this.authClient.send('verify_token', {
          token: signInResponse.data.authToken,
        }),
      );
      if (tokenVerify.roles[0] === '')
        throw new BadRequestException('Bad Request');
      if (tokenVerify.roles[0] === 'SYSTEM_ADMIN') {
        if (shortCompanyName === 'CheckMyDbs') {
          return {
            data: {
              ...signInResponse.data,
              ...tokenVerify,
            },
            message: signInResponse.message,
            error: null,
          };
        } else {
          throw new BadRequestException('Bad Request');
        }
      }
      if (tokenVerify.roles[0] === 'COMPANY_ADMIN') {
        const res = await firstValueFrom(
          this.userClient.send('check_company', dto),
        );
      }
      if (tokenVerify.roles[0] !== 'COMPANY_ADMIN') {
        const res = await firstValueFrom(
          this.userClient.send('check_company_short_name', dto),
        );
        if (res.message === 'User_Not_Found') {
          throw new BadRequestException('Invalid User');
        }
      }
      return {
        data: {
          ...signInResponse.data,
          ...tokenVerify,
        },
        message: 'Password Created Successfully',
        error: null,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
  /*********************************************Sign-In__With-Temp_Individual **************************************************/

  @Post('/change_temp_password_Individual')
  async signinTempIndividual(@Body() dto: SignInTempPassRequestDto) {
    try {
      await firstValueFrom(this.userClient.send('check_individual', dto));
      const signInResponse = await firstValueFrom(
        this.authClient.send('change-temp-password', dto),
      );
      const tokenVerify = await firstValueFrom(
        this.authClient.send('verify_token', {
          token: signInResponse.data.authToken,
        }),
      );
      if (tokenVerify.roles[0] !== 'INDIVIDUAL_USER')
        throw new BadRequestException('Signin as INDIVIDUAL_USER');
      return {
        data: {
          ...signInResponse.data,
          ...tokenVerify,
        },
        message: 'Password Created Successfully',
        error: null,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /*********************************************Sign-In__Individual **************************************************/
  @ApiCreatedResponse({
    type: SigninIndividualResponseDto,
  })
  @Post('/signin/individual')
  async signinIndividual(@Body() dto: SigninIndividualRequestDto) {
    try {
      await firstValueFrom(this.userClient.send('check_individual', dto));
      const signInResponse = await firstValueFrom(
        this.authClient.send('signin', dto),
      );
      const tokenVerify = await firstValueFrom(
        this.authClient.send('verify_token', {
          token: signInResponse.data.authToken,
        }),
      );
      if (tokenVerify.roles[0] !== 'INDIVIDUAL_USER')
        throw new BadRequestException('Signin as INDIVIDUAL_USER');
      return {
        data: {
          ...signInResponse.data,
          ...tokenVerify,
        },
        message: signInResponse.message,
        error: null,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /*********************************************sign-In--Company **************************************************/
  @ApiCreatedResponse({
    type: SigninCompanyResponseDto,
  })
  @Post('/signin/company')
  async signinCompany(@Body() dto: SigninCompanyRequestDto) {
    try {
      const { shortCompanyName } = dto;
      console.log(shortCompanyName);
      const signInResponse = await firstValueFrom(
        this.authClient.send('signin', dto),
      );
      const tokenVerify = await firstValueFrom(
        this.authClient.send('verify_token', {
          token: signInResponse.data.authToken,
        }),
      );
      if (tokenVerify.roles[0] === '')
        throw new BadRequestException('Bad Request');
      if (tokenVerify.roles[0] === 'SYSTEM_ADMIN') {
        if (shortCompanyName === 'CheckMyDbs') {
          return {
            data: {
              ...signInResponse.data,
              ...tokenVerify,
            },
            message: signInResponse.message,
            error: null,
          };
        } else {
          throw new BadRequestException('Bad Request');
        }
      }
      if (tokenVerify.roles[0] === 'COMPANY_ADMIN') {
        const res = await firstValueFrom(
          this.userClient.send('check_company', dto),
        );
      }
      if (tokenVerify.roles[0] !== 'COMPANY_ADMIN') {
        const res = await firstValueFrom(
          this.userClient.send('check_company_short_name', dto),
        );

        if (res.message === 'User_Not_Found') {
          throw new BadRequestException('Invalid User');
        }
      }
      return {
        data: {
          ...signInResponse.data,
          ...tokenVerify,
        },
        message: signInResponse.message,
        error: null,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /*********************************************Sign-Out **************************************************/

  @Post('signout')
  async signout(@Body() dto: SignOutRequestDto) {
    return this.authClient.send('signout', dto);
  }

  /*********************************************Assign-Role **************************************************/

  @Post('assign-role')
  async assignRole(@Body() dto: AssignRoleRequestDto) {
    return this.authClient.send('assign_role', dto);
  }

  /*********************************************Change-Password-Company **************************************************/

  @Post('/change_password_company')
  async changePasswordCompany(@Body() dto: ChangePasswordCompanydDto) {
    return this.authClient.send('change_password', dto);
  }

  /*********************************************Change-Password-Individual**************************************************/

  @Post('/change_password_Individual')
  async changePasswordIndividual(@Body() dto: ChangePasswordDto) {
    return this.authClient.send('change_password', dto);
  }

  /*********************************************Re-send-Code **************************************************/

  @Post('/resendCode')
  async resendCode(@Body() dto: ResendCodeDto) {
    return this.authClient.send('resendCode', dto);
  }

  /*********************************************Forgot-Password-Company **************************************************/

  @Post('/forgotPasswordCompany')
  public async forgotPasswordCompany(@Body() dto: forgotPasswordCompanyDto) {
    const check = await firstValueFrom(
      this.userClient.send('check_company_forgot_passowrd', dto),
    );
    console.log(check, 'check');
    return this.authClient.send('forgotPassword', dto);
  }

  /*********************************************Forgot-Password-Individual **************************************************/

  @Post('/forgotPasswordIndividual')
  public async forgotPassword(@Body() dto: forgotPasswordDto) {
    const check = await firstValueFrom(
      this.userClient.send('check_individual', dto),
    );
    console.log(check, 'check');
    return this.authClient.send('forgotPassword', dto);
  }

  /*********************************************Confrim-forgot-Password **************************************************/

  @Post('/confrimforgotpassword')
  public async confirmForgotPassword(@Body() dto: confirmForgotPasswordDto) {
    return await this.authClient.send('confrimforgotpassword', dto);
  }
}
