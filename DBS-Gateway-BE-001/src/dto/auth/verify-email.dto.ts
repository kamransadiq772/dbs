import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class VerifyEmailRequestDto {
  @ApiProperty({
    example: 'admin@orcalo.co.uk',
  })
  email: string;
  @ApiProperty({
    example: 'xe7d3f',
  })
  code: string;
}

export class VerifyEmailResponseDto extends ApiResponseDto{
  @ApiProperty({ default: 'Your email address is verified successfully.' })
  status: string;
  message: string;
}
