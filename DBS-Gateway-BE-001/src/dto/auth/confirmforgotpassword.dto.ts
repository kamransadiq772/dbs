import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class confirmForgotPasswordDto {
  @ApiProperty()
  Username: string;
  @ApiProperty()
  ConfirmationCode: string;
  @ApiProperty()
  Password: string;
}
export class ConfirmForgotPasswordResponseDto extends ApiResponseDto {
  @ApiProperty({ example: 'Your password have been successfully changed.' })
  message: string;
}