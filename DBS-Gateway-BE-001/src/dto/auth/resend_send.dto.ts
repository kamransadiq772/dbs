import { ApiProperty } from '@nestjs/swagger';
// import { ApiResponseDto } from '../common/ApiResponse.dto';
export class ResendCodeDto {
  //   @ApiProperty({
  //     example: '37925c09-1d21-40ab-ba35-1535af12075b',
  //   })
  //   token: string;

  @ApiProperty({
    minLength: 8,
    example: 'maaz.ahmad+433@ceative.co.uk',
  })
  email: string;

  // @ApiProperty({
  //   minLength: 8,
  //   example: 'Test111@1',
  // })
  // new_password: string;
}

// export class ChangePasswordResponseDto {}
