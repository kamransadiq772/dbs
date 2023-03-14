// import { IUser } from '../../interfaces/user';
import { ApiResponseDto } from '../common/ApiResponse.dto';
import {
  ICompanyDetails,
  IYourDetails,
  ICompanyAdminUser,
  ICompanyPreferences,
} from '../../interfaces/auth';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Role } from '../../interfaces/role';

export class UpdateCompanyRequestDto {
  userId: string;
  @ApiProperty({
    example: {
      companyName: 'ORCALO LMTD',
      shortName: 'ORCL',
      companyNumber: 3254,
      organizationType: 'private company ltd',
      postCode: 'abd323',
      addressLine1: 'office k2, business square, uxbridge',
      addressLine2: 'office k1, business square, uxbridge',
      townOrCity: 'uxbridge',
      country: 'uk',
      email: 'soban.taimoor@ceative.co.uk',
      phone: '+923013',
      mobile: '+923015586305',
    },
  })
  companyDetails?: ICompanyDetails;
  @ApiProperty({
    example: {
      foreName: 'Merry',
      surName: 'anne',
      gender: 'Female',
      postCode: 'ABD48651',
    },
  })
  yourDetails?: IYourDetails;
  @ApiProperty({
    example: {
      foreName: 'david',
      surName: 'steven',
      email: 'dsadsa@das.com',
      mobile: 543321321,
    },
  })
  companyAdminUser?: ICompanyAdminUser;
}

export class UpdateCompanyResponseDto extends ApiResponseDto {
  data: {
    user: UpdateCompanyRequestDto;
  };
}
