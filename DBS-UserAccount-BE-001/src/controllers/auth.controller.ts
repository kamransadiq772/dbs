import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SignupDto, VerifyEmailDto, SigninDto } from '../dto/auth';
import { SignInTempPassDto } from '../dto/auth/SignInTempPass.dto';
import { SignoutDto } from '../dto/token/sign-out.dto';
import { RevokeTokenDto } from '../dto/token/revoke-token.dto';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  /*********************************************Sign-Up **************************************************/

  @MessagePattern('signup')
  async signup(@Payload() payload: SignupDto) {
    console.log(payload, 'payload');
    return await this.authService.signup(payload);
  }

  /*********************************************Verify-Email **************************************************/

  @MessagePattern('signout')
  async signout(@Payload() payload: SignoutDto) {
    return await this.authService.signout(payload);
  }

  @MessagePattern('verify_email')
  async verifyEmail(@Payload() payload: VerifyEmailDto) {
    // console.log(payload)
    return await this.authService.verifyEmail(payload);
  }

  /*********************************************Sign-In-Temp-Password **************************************************/

  @MessagePattern('change-temp-password')
  async signinTempPass(@Payload() payload: SignInTempPassDto) {
    // console.log(payload);
    return await this.authService.signInTempPass(payload);
  }

  /*********************************************Sign-In **************************************************/

  @MessagePattern('signin')
  async signin(@Payload() payload: SigninDto) {
    //  console.log(payload);
    return await this.authService.signin(payload);
  }

  /*********************************************Change-Password **************************************************/

  @MessagePattern('change_password')
  async changePassword(@Payload() payload) {
    return await this.authService.changePassword(payload);
  }

  /*********************************************Resend-Code **************************************************/

  @MessagePattern('resendCode')
  async resendCode(@Payload() payload) {
    return await this.authService.resendCode(payload);
  }

  /*********************************************Forgot-Password **************************************************/

  @MessagePattern('forgotPassword')
  public async forgotPassword(data: any): Promise<any> {
    let result: any;
    if (data) {
      try {
        let email = data.email;
        const createResult: any = await this.authService.forgotPassword(email);
        if (createResult.error) {
          result = {
            status: HttpStatus.BAD_REQUEST,
            message: createResult.error,
            data: null,
          };
        } else {
          result = {
            status: HttpStatus.OK,
            message: 'forgot password success',
            data: {
              status: createResult.status,
              message: createResult.message,
            },
          };
        }
      } catch (e) {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: e.message,
          data: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        mesage: 'forgot password bad request',
        data: null,
      };
    }
    return result;
  }

  /*********************************************Confrim-forgot-Password **************************************************/

  @MessagePattern('confrimforgotpassword')
  public async confrimforgotPassword(data: any): Promise<any> {
    let result;
    if (data) {
      try {
        const { Username, ConfirmationCode, Password } = data;
        const createResult: any = await this.authService.confirmForgotPassword(
          Username,
          ConfirmationCode,
          Password,
        );
        //console.log("authcontroller",createResult);

        if (createResult.error) {
          result = {
            status: HttpStatus.BAD_REQUEST,
            message: createResult.error,
            data: null,
          };
        } else {
          result = {
            status: HttpStatus.OK,
            messgae: createResult.message,
            data: {
              status: createResult.status,
            },
          };
        }
      } catch (e) {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: e.message,
          data: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'confirm_forgot_password_success_bad_request',
        data: null,
      };
    }
    return result;
  }
}
