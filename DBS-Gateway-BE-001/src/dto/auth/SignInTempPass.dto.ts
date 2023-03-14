import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class SignInTempPassRequestDto {
  @ApiProperty({
    example: 'Enter your Email',
  })
  email: string;
  @ApiProperty({
    example: 'Send in your email',
  })
  temp_password: string;
  @ApiProperty({
    example: 'enter your new password',
  })
  new_password: string;
}

export class SignInTempPassResponseDto extends ApiResponseDto{
  authToken: string;
  refreshToken: string;
  user: any;
}
