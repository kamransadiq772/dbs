import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class SigninIndividualRequestDto {
  @ApiProperty({
    example: 'maaz.ahmad@ceative.co.uk',
  })
  email: string;
  @ApiProperty({
    example: 'Admin@123!',
  })
  password: string;
}

export class SigninUserRequestDto {
  
  @ApiProperty({
    example: 'ORCL',
  })
  shortCompanyName: string;
  @ApiProperty({
    example: 'email@ceative.co.uk',
  })
  email: string;
  @ApiProperty({
    example: 'Admin@123!',
  })
  password: string;
}
export class SigninIndividualResponseDto extends ApiResponseDto {
  authToken: string;
  refreshToken: string;
  user: any;
}
