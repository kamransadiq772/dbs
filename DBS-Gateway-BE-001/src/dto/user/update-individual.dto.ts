// import { IUser } from '../../interfaces/user';
import { ApiResponseDto } from '../common/ApiResponse.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Role } from '../../interfaces/role';

export class UpdateIndividualRequestDto {
  userId: string;
  @ApiProperty({
    example: 'Maaz',
  })
  @IsNotEmpty()
  foreName: string;

  @ApiProperty({
    example: 'Ahmad',
  })
  @IsNotEmpty()
  surName: string;

  @ApiProperty({
    example: '21/02/1994',
  })
  @IsNotEmpty()
  DOB: string;

  @ApiProperty({
    example: 'maaz.ahmad@ceative.co.uk',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Maaz Ahmad',
  })
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    example: 'Male',
  })
  gender: string;

  @ApiProperty({
    example: '+92301558',
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: '+923015586305',
  })
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({
    example: 'American',
  })
  nationality: string;

  @ApiProperty({
    example: 'addressFirstLine',
  })
  addressFirstLine: string;

  @ApiProperty({
    example: 'addressSecondLine',
  })
  addressSecondLine: string;

  @ApiProperty({
    example: 'USA',
  })
  country: string;

  @ApiProperty({
    example: 'Washington',
  })
  townCity: string;

  @ApiProperty({
    example: 4343,
  })
  @IsNotEmpty()
  postCode: string;

  @ApiProperty({
    example: 'Evidence Checker',
  })
  userType: string;

  @ApiProperty({
    example: 'rightToWork',
  })
  rightToWork: string;
}

export class UpdateIndividualResponseDto extends ApiResponseDto {
  data: {
    user: UpdateIndividualRequestDto;
  };
}
