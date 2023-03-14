// import { IUser } from '../../interfaces/user';
import { ApiResponseDto } from '../common/ApiResponse.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Role } from '../../interfaces/role';

export class CreateIndividualRequestDto {
  @ApiProperty({
    example: 'Bank Manager',
  })
  @IsNotEmpty()
  positionApplyingFor: string;
  @ApiProperty({
    example: 'Basic',
  })
  @IsNotEmpty()
  disclosureType: string;
  @ApiProperty({
    example: true,
  })
  isVolunteer: boolean;
  @ApiProperty({
    example: true,
  })
  willPay: boolean;
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
    example: 4343,
  })
  @IsNotEmpty()
  postCode: string;
  @ApiProperty({
    example: 'Maaz Ahmad',
  })
  @IsNotEmpty()
  userName: string;
  @ApiProperty({
    example: 'maaz.ahmad@ceative.co.uk',
  })
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    example: 'Amin@123',
  })
  password: string;
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
    example: true,
  })
  @IsNotEmpty()
  dataPolicy: boolean;
  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  termsPolicy: boolean;
  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  privacyPolicy: boolean;
  @ApiProperty({
    example: Role.INDIVIDUAL_USER,
  })
  @IsNotEmpty()
  defaultRole: string;
}

export class CreateIndividualResponseDto extends ApiResponseDto {
  data: {
    user: CreateIndividualRequestDto;
  };
}
