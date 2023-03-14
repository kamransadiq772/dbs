import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class SigninCompanyRequestDto {
  @ApiProperty({
    example: 'ORCL',
  })
  shortCompanyName: string;
  @ApiProperty({
    example: 'soban.taimoor@ceative.co.uk',
  })
  email: string;
  @ApiProperty({
    example: 'TEMP_pw1234',
  })
  password: string;

}

export class SigninCompanyResponseDto extends ApiResponseDto {
  authToken: string;
  refreshToken: string;
  user: any;
}
