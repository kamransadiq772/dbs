import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VerifyTokenDto, RefreshTokenDto, RevokeTokenDto } from '../dto/token';
import { TokenService } from '../services/token.service';

@Controller()
export class TokenController {
  constructor(private readonly tokenService: TokenService) { }

  @MessagePattern('verify_token')
  async verifyToken(@Payload() payload: VerifyTokenDto) {
    Logger.debug("account")
    return await this.tokenService.verifyToken(payload);
  }

  @MessagePattern('refresh_token')
  async refreshToken(@Payload() payload: RefreshTokenDto) {
    return await this.tokenService.refreshToken(payload);
  }

  @MessagePattern('revoke_token')
  async revokeToken(@Payload() payload: RevokeTokenDto) {
    return await this.tokenService.revokeToken(payload);
  }
}
