import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class forgotPasswordCompanyDto {
  @ApiProperty({
    example: 'ORCL',
  })
  shortCompanyName: string;
  @ApiProperty({
    example: 'maaz.ahmad+77@ceative.co.uk',
  })
  email: string;
}

export class ForgotPasswordResponseDto extends ApiResponseDto {
  @ApiProperty({ example: 'Please Check your email to reset password.' })
  message: string;
}
