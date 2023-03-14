import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/ApiResponse.dto';
// import { ApiResponseDto } from '../common/ApiResponse.dto';
export class ChangePasswordCompanydDto {
    @ApiProperty({
      example: '37925c09-1d21-40ab-ba35-1535af12075b',
    })
    token: string;
    @ApiProperty({
      example: 'Enter your Short Company name',
    })
    shortCompanyName: string;
  @ApiProperty({
    minLength: 8,
    example: 'Test111@',
  })
  old_password: string;

  @ApiProperty({
    minLength: 8,
    example: 'Test111@1',
  })
  new_password: string;
}

export class ChangePasswordCompanydResponseDto extends ApiResponseDto {

  @ApiProperty({ example: 'Successfully Change Password Company.' })
  message: string;
}
// export class ChangePasswordResponseDto {}
