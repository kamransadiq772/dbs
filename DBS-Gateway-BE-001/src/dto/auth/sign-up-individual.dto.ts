import { ApiProperty } from '@nestjs/swagger';
//import { ApiResponseDto } from './ApiResponse.dto';
import { Role } from '../../interfaces/role';
import { IsNotEmpty } from 'class-validator';
// import { User } from '../../interfaces/user';
import { ApiResponseDto } from '../common/ApiResponse.dto';


export class SignupIndividualRequestDto {
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

export class SignupIndividualResponsetDto extends ApiResponseDto {
  @ApiProperty({ example: 'user_create_success' })
  message: string;
  @ApiProperty({
    example: {
      user: {
        positionApplyingFor: "Bank Manager",
        disclosureType: "Basic",
        isVolunteer: true,
        willPay: true,
        foreName: "Maaz",
        surName: "Ahmad",
        DOB: "21/02/1994",
        postCode: 4343,
        userName: "Maaz Ahmad",
        email: "maaz.ahmad@ceative.co.uk",
        phone: "+92301558",
        mobile: "+923015586305",
        dataPolicy: true,
        termsPolicy: true,
        privacyPolicy: true,
        defaultRole: "INDIVIDUAL_USER",
        is_confirmed: false,
        id: '5d987c3bfb881ec86b476bcc',
      },
    },
    nullable: true,
  })
  data: {
    user: {
      positionApplyingFor: string,
      disclosureType: string,
      isVolunteer: boolean,
      willPay: boolean,
      foreName: string,
      surName: string,
      DOB: string,
      postCode: number,
      userName: string,
      email: string,
      phone: string,
      mobile: string,
      dataPolicy: boolean,
      termsPolicy: boolean,
      privacyPolicy: boolean,
      defaultRole: string,
      is_confirmed: boolean;
      id: string;
    };
    token?: string;
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
