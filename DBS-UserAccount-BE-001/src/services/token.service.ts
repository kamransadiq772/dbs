import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { createHmac } from 'crypto';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import {
  InitiateAuthRequest,
  RevokeTokenRequest,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { VerifyTokenDto, RefreshTokenDto, RevokeTokenDto } from '../dto/token';

@Injectable()
export class TokenService {
  protected readonly logger = new Logger('AUTH_TOKEN_MICROSERVICE');

  constructor(
    private config: ConfigService,
    @Inject('CognitoIDP') private cognitoIDP: CognitoIdentityServiceProvider,
  ) { }

  async verifyToken({ tokenUse, token }: VerifyTokenDto) {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USERPOOL_ID,
      tokenUse: tokenUse || 'access',
      clientId: process.env.COGNITO_CLIENT_ID,
    });

    try {
      const payload = await verifier.verify(token);
      const { sub } = payload;
      return {
        userId: sub,
        roles: payload['cognito:groups'],
      };
    } catch {
      throw new RpcException('TOKEN_VERIFICATION_FAILED');
    }
  }

  async refreshToken({ email, refreshToken }: RefreshTokenDto) {
    try {
      const SECRET_HASH = this.getSecretHash(
        email,
        this.config.get('COGNITO_CLIENT_ID'),
        this.config.get('COGNITO_CLIENT_SECRET'),
      );
      const params: InitiateAuthRequest = {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
          SECRET_HASH,
        },
        ClientId: this.config.get('COGNITO_CLIENT_ID'),
      };
      const response = await this.cognitoIDP.initiateAuth(params).promise();
      return {
        ...response?.AuthenticationResult,
      };
    } catch (err) {
      throw new RpcException('RERESH_TOKEN_FAILED');
    }
  }

  async revokeToken({ email, refreshToken }: RevokeTokenDto) {
    try {
      const ClientSecret = this.getSecretHash(
        email,
        this.config.get('COGNITO_CLIENT_ID'),
        this.config.get('COGNITO_CLIENT_SECRET'),
      );
      const params: RevokeTokenRequest = {
        ClientSecret,
        Token: refreshToken,
        ClientId: this.config.get('COGNITO_CLIENT_ID'),
      };
      await this.cognitoIDP.revokeToken(params).promise();
      return {
        status: 'TOKEN_REVOKED',
      };
    } catch (err) {
      throw new RpcException('REVOKE_TOKEN_FAILED');
    }
  }

  private getSecretHash(
    username: string,
    clientId: string,
    clientSecret: string,
  ) {
    const hasher = createHmac('sha256', clientSecret);
    hasher.update(`${username}${clientId}`);
    return hasher.digest('base64');
  }
}
