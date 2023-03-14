import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { createHmac } from 'crypto';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import {
  ConfirmSignUpRequest,
  InitiateAuthRequest,
  SignUpRequest,
  ResendConfirmationCodeRequest,
  AdminRespondToAuthChallengeRequest,
  AdminCreateUserRequest,
  ForgotPasswordRequest,
  ConfirmForgotPasswordRequest,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { SigninDto, SignupDto, VerifyEmailDto } from '../dto/auth';
import { SignInTempPassDto } from '../dto/auth/SignInTempPass.dto';
import { TokenService } from './token.service';
import { ChangePasswordRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { date } from 'joi';

/*********************************************InJectable **************************************************/

@Injectable()
export class AuthService {
  protected readonly logger = new Logger('AUTH_MICROSERVICE');

  /*********************************************constructor **************************************************/

  constructor(
    private config: ConfigService,
    private tokenService: TokenService,
    @Inject('CognitoIDP') private cognitoIDP: CognitoIdentityServiceProvider,
  ) {}

  /*********************************************Sign-Up **************************************************/

  async signup(data: SignupDto) {
    const { email, defaultRole, shortName } = data;
    console.log('emailService', email, 'emailservice', defaultRole);

    const SecretHash = this.getSecretHash(
      email,
      this.config.get('COGNITO_CLIENT_ID'),
      this.config.get('COGNITO_CLIENT_SECRET'),
    );
    // this.logger.debug(email, this.config.get('COGNITO_CLIENT_ID'), this.config.get('COGNITO_USERPOOL_ID'))
    //  this.logger.debug(email, this.config.get('COGNITO_CLIENT_ID'), this.config.get('COGNITO_USERPOOL_ID'))
    try {

      if(defaultRole === "INDIVIDUAL_USER") {
        const params: AdminCreateUserRequest = {
          UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
          TemporaryPassword: 'TEMP_pw123',
          Username: email,
          UserAttributes: [{
            Name: "custom:defaultRole",
            Value: defaultRole
          }]
        };
  
        Logger.log(params, "params")
  
        const response = await this.cognitoIDP.adminCreateUser(params).promise();
        // this.logger.debug("authservics",response)
        //  this.logger.debug("authservics", params)
  
        console.log(response);
  
        return {
          userId: response.User.Username,
          message:
            'User signed up successfully. Kindly check your email address.',
        };
      }

      
      const params: AdminCreateUserRequest = {
        UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
        TemporaryPassword: 'TEMP_pw123',
        Username: email,
        UserAttributes: [{
          Name: "custom:defaultRole",
          Value: defaultRole,
        }, 
        {
          Name: "custom:shortCompanyName",
          Value: shortName
        }]
      };

      Logger.log(params, "params1")

      const response = await this.cognitoIDP.adminCreateUser(params).promise();

      console.log(response);

    return {
      userId: response.User.Username,
      message:
        'User signed up successfully. Kindly check your email address.',
     };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  /*********************************************Verify-Email **************************************************/

  async verifyEmail(data: VerifyEmailDto) {
    const { email, code } = data;
    try {
      const SecretHash = this.getSecretHash(
        email,
        this.config.get('COGNITO_CLIENT_ID'),
        this.config.get('COGNITO_CLIENT_SECRET'),
      );

      const params: ConfirmSignUpRequest = {
        ClientId: this.config.get('COGNITO_CLIENT_ID'),
        SecretHash,
        Username: email,
        ConfirmationCode: code,
      };

      const confirm = await this.cognitoIDP.confirmSignUp(params).promise();
      console.log(confirm);
      return {
        data: null,
        message: 'Your email address is verified successfully.',
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
      // return {
      //   message: err.message,
      //   data: null,
      //   errors: null,
      // };
    }
  }

  /*********************************************Sign-In-Temp-Password **************************************************/

  async signInTempPass(data: SignInTempPassDto) {
    const { email, new_password, temp_password } = data;

    try {
      const SECRET_HASH = this.getSecretHash(
        email,
        this.config.get('COGNITO_CLIENT_ID'),
        this.config.get('COGNITO_CLIENT_SECRET'),
      );

      let p: any = {
        UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
        Username: email,
        UserAttributes: [{ Name: 'email_verified', Value: 'true' }],
      };
      const confirmed = await this.cognitoIDP
        .adminUpdateUserAttributes(p)
        .promise();
      console.log('confirmedconfirmedconfirmed-----', confirmed);

      var login_params: InitiateAuthRequest = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: temp_password,
          SECRET_HASH,
        },
        ClientId: this.config.get('COGNITO_CLIENT_ID'),
      };
      var { Session } = await this.cognitoIDP
        .initiateAuth(login_params)
        .promise();

      //this.logger.debug("authservics", Session)
      if (Session) {
        var params: AdminRespondToAuthChallengeRequest = {
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          ClientId: this.config.get('COGNITO_CLIENT_ID'),
          UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
          Session: Session,
          ChallengeResponses: {
            SECRET_HASH,
            USERNAME: email,
            OLD_PASSWORD: temp_password,
            NEW_PASSWORD: new_password,
          },
        };
        var { AuthenticationResult } = await this.cognitoIDP
          .adminRespondToAuthChallenge(params)
          .promise();
        const { AccessToken, RefreshToken } = AuthenticationResult;
        return {
          data: {
            authToken: AccessToken,
            refreshToken: RefreshToken,
            // user
          },
          message: 'Successfully logged in.',
          errors: null,
        };
      } else {
        return {
          // data: {
          //   // authToken: AccessToken,
          //   // refreshToken: RefreshToken,
          //   // user
          // },
          message:
            'You Already Change Your Password. If you Forget please Reset Your Password',
          errors: null,
        };
      }
    } catch (err) {
      console.log('errrrr-----', err);
      throw new RpcException(err);
    }
  }

  /*********************************************Sign-In **************************************************/

  async signin(data: SigninDto) {
    const { email, password } = data;

    try {
      const SECRET_HASH = this.getSecretHash(
        email,
        this.config.get('COGNITO_CLIENT_ID'),
        this.config.get('COGNITO_CLIENT_SECRET'),
      );
      const params: InitiateAuthRequest = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH,
        },
        ClientId: this.config.get('COGNITO_CLIENT_ID'),
      };

      const { AuthenticationResult } = await this.cognitoIDP
        .initiateAuth(params)
        .promise();
      const { AccessToken, RefreshToken } = AuthenticationResult;

      return {
        data: {
          authToken: AccessToken,
          refreshToken: RefreshToken,
          // user
        },
        message: 'Successfully logged in.',
        errors: null,
      };
    } catch (err) {
      console.log('-------------------', err, '----------------------');

      throw new RpcException(err);
    }
  }

  /*********************************************Sign-Out **************************************************/

  public async signout(data: any) {
    const { accessToken } = data;

    try {
      const SecretHash = this.getSecretHash(
        accessToken,
        this.config.get('COGNITO_AWS_ACCESS_KEY'),
        this.config.get('COGNITO_AWS_SECRET_KEY'),
      );

      const params: any = {
        AccessToken: accessToken,
      };
      await this.cognitoIDP.globalSignOut(params).promise();
      return {
        data: null,
        message: 'Successfully logged out.',
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  /*********************************************Forgot-Password **************************************************/

  public async forgotPassword(email: string) {
    try {
      console.log('----------email--------', email, 'email');
      const SecretHash = this.getSecretHash(
        email,
        this.config.get('COGNITO_CLIENT_ID'),
        this.config.get('COGNITO_CLIENT_SECRET'),
      );

      const params: ForgotPasswordRequest = {
        ClientId: this.config.get('COGNITO_CLIENT_ID'),
        SecretHash,
        Username: email,
      };
      console.log(params);
      let a = await this.cognitoIDP.forgotPassword(params).promise();
      console.log('---------For-----------------', a, '----------------------');
      return {
        data: a,
        message: 'Check your email to reset password.',
        errors: null,
      };
    } catch (err) {
      console.log('errrrrr', err);
      throw new RpcException(err);
    }
  }

  /*********************************************Confirm-Forgot-Password **************************************************/

  public async confirmForgotPassword(email, code, password) {
    try {
      // console.log(email)
      const SecretHash = this.getSecretHash(
        email,
        this.config.get('COGNITO_CLIENT_ID'),
        this.config.get('COGNITO_CLIENT_SECRET'),
      );

      const params: ConfirmForgotPasswordRequest = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        Password: password,
        SecretHash,
      };
      await this.cognitoIDP.confirmForgotPassword(params).promise();
      //console.log('authservice',abc)

      return {
        data: null,
        message: 'Your password have been successfully changed.',
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  /*********************************************Resend-Code **************************************************/

  public async resendCode({ email }) {
    try {
      const SecretHash = this.getSecretHash(
        email,
        this.config.get('COGNITO_CLIENT_ID'),
        this.config.get('COGNITO_CLIENT_SECRET'),
      );

      const params: ForgotPasswordRequest = {
        ClientId: this.config.get('COGNITO_CLIENT_ID'),
        SecretHash,
        Username: email,
      };

      await this.cognitoIDP.resendConfirmationCode(params).promise();
      return {
        message: 'Link is resent. Kindly check your email address',
        data: null,
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  /*********************************************Change-Password **************************************************/

  public async changePassword({ token, old_password, new_password }) {
    try {
      const params: ChangePasswordRequest = {
        AccessToken: token,
        PreviousPassword: old_password,
        ProposedPassword: new_password,
      };
      await this.cognitoIDP.changePassword(params).promise();
      return {
        message: 'Your password have been successfully changed',
        data: null,
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  /*********************************************getSecretHash **************************************************/

  private getSecretHash(
    username: string,
    clientId: string,
    clientSecret: string,
  ) {
    const hasher = createHmac('sha256', clientSecret);
    hasher.update(`${username}${clientId}`);
    return hasher.digest('base64');
  }

  private formUserAttributes(attribs) {
    return [
      { Name: 'custom:email', Value: attribs.email },
      { Name: 'custom:password', Value: attribs.password },
    ];
  }
}
