import { ApiResponseDto } from '../common/ApiResponse.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateProfilePicRequestDto {
  userId: string;
  @ApiProperty({
    example: 'dsadsadasr32kbv2vtkj3iob',
  })
  @IsNotEmpty()
  profilePic: string;
}

export class CreateCompanyResponseDto extends ApiResponseDto {
  data: {
    CreateProfilePicRequestDto;
  };
}
