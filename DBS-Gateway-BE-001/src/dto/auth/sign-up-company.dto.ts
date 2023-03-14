import { ApiProperty } from '@nestjs/swagger';
//import { ApiResponseDto } from './ApiResponse.dto';
import { Role } from '../../interfaces/role';
import {
  ICompanyDetails,
  IYourDetails,
  ICompanyAdminUser,
  ICompanyPreferences,
} from '../../interfaces/auth';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class SignupCompanyRequestDto {
  @ApiProperty({
    example: {
      companyName: 'ORCALO LMTD',
      shortName: 'ORCL',
      companyNumber: 3254,
      organizationType: 'private company ltd',
      postCode: 'ABS323',
      addressLine1: 'office k2, business square, uxbridge',
      addressLine2: 'office k1, business square, uxbridge',
      townOrCity: 'uxbridge',
      country: 'uk',
      email: 'yixihi3957@adroh.com',
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
      postCode: 'A4891651',
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

export class SignupCompanyResponsetDto extends ApiResponseDto {
  @ApiProperty({ example: 'user_create_success' })
  message: string;
  @ApiProperty({
    example: {
      user: {
        companyDetails: {
          companyName: 'ORCALO LMTD',
          shortName: 'ORCL',
          companyNumber: 3254,
          organizationType: 'private company ltd',
          postCode: 'ABD323',
          addressLine1: 'office k2, business square, uxbridge',
          addressLine2: 'UB111FW',
          townOrCity: 'uxbridge',
          country: 'uk',
          email: 'yixihi3957@adroh.com',
          phone: '+923013',
          mobile: '+923015586305',
          serviceRequired: 'DBS and training',
        },
        yourDetails: {
          foreName: 'Merry',
          surName: 'anne',
          gender: 'Female',
          postCode: 4891651,
          adminUser: true,
        },
        companyAdminUser: {
          foreName: 'maaz',
          surName: 'satti',
          email: 'dsadsa@dasa.com',
        },
        companyPreferences: {
          privacyPolicy: true,
          dataPolicy: true,
          termsPolicy: true,
        },
        defaultRole: 'COMPANY_ADMIN',
        is_confirmed: false,
        id: '5d987c3bfb881ec86b476bcc',
      },
    },
    nullable: true,
  })
  data: {
    user: {
      companyDetails: {
        companyName: string;
        shortName: string;
        companyNumber: number;
        organizationType: string;
        postCode: string;
        addressLine1: string;
        addressLine2: string;
        townOrCity: string;
        country: string;
        email: string;
        phone: string;
        mobile: string;
        serviceRequired: string;
      };
      yourDetails: {
        foreName: string;
        surName: string;
        gender: string;
        postCode: string;
        adminUser: boolean;
      };
      companyAdminUser: {
        foreName: string;
        surName: string;
        email: string;
      };
      companyPreferences: {
        privacyPolicy: boolean;
        dataPolicy: boolean;
        termsPolicy: boolean;
      };
      defaultRole: string;
      is_confirmed: boolean;
      id: string;
    };
    token?: string;
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
