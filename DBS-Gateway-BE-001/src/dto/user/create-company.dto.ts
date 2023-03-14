// import { IUser } from '../../interfaces/user';
import { ApiResponseDto } from '../common/ApiResponse.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Role } from '../../interfaces/role';
import {
  ICompanyDetails,
  IYourDetails,
  ICompanyAdminUser,
  ICompanyPreferences,
} from '../../interfaces/auth';

export class CreateCompanyRequestDto {
  @ApiProperty({
    example: {
      companyName: 'ORCALO LMTD',
      shortName: 'ORCL',
      companyNumber: 3254,
      organizationType: 'private company ltd',
      postCode: 'BAD323',
      addressLine1: 'office k2, business square, uxbridge',
      addressLine2: 'office k1, business square, uxbridge',
      townOrCity: 'uxbridge',
      country: 'uk',
      email: 'yixihi3957@adroh.com',
      password: 'Admin@123!',
      phone: '+923013',
      mobile: '+923015586305',
      serviceRequired: 'DBS and training',
    },
  })
  companyDetails: ICompanyDetails;
  @ApiProperty({
    example: {
      foreName: 'Merry',
      surName: 'anne',
      gender: 'Female',
      postCode: 'ACS4651',
      adminUser: true,
    },
  })
  yourDetails: IYourDetails;
  @ApiProperty({
    example: {
      foreName: 'david',
      surName: 'steven',
      email: 'dsadsa@das.com',
    },
  })
  companyAdminUser: ICompanyAdminUser;
  @ApiProperty({
    example: {
      privacyPolicy: true,
      dataPolicy: true,
      termsPolicy: true,
    },
  })
  companyPreferences: ICompanyPreferences;
  @ApiProperty({
    example: Role.COMPANY_ADMIN,
  })
  @IsNotEmpty()
  defaultRole: string;
}

export class CreateCompanyResponseDto extends ApiResponseDto {
  data: {
    user: CreateCompanyRequestDto;
  };
}
