import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IAllUser,
  IBasic,
  IUser,
} from 'src/interfaces/admin/create.user.interface';
import { ApiResponseDto } from '../common/ApiResponse.dto';
import { Role } from '../../interfaces/role';
import { IsNotEmpty, ValidateNested } from 'class-validator';
/**
 * Create Application by Company Admin ......start
 */
export class CreateAdminUserRequestDto {
  @ApiProperty({
    example: {
      userType: 'Evidence Checker',
      forename: 'Muhammad Ali',
      surname: 'Ahmed',
      username: 'afaq22',
      dateOfBirth: '12/09/1998',
      phone: '+923015586305',
      mobile: '+923015586305',
      email: 'maaz.ahmad+450@ceative.co.uk',
      postCode: '2s2d234',
      Active: false,
      userAddressLine1: 'office k1, business square, uxbridge',
      userAddressLine2: 'office k2, business square, uxbridge',
      userTownOrCity: 'uxbridge',
    },
  })
  AllUser: IAllUser;
  @ApiProperty({
    example: {
      isUnderstoodDBSCodeOfPractice: true,
      isUnderstoodDBSIdChecking: true,
      isUnderstoodDBSIdcheckScenarios: true,
      isPersonHasFamiliarWithInfoOnDBS: true,
      electronicSignature: '54yhdfishg8745ythgie',
    },
  })
  UserDetails: IUser;

  @ApiProperty({
    example: {
      DisclosureType: 'Basic',
      PositionApplyingFor: 'string',
      isfreeCOVID19DBScheck: false,
      ThisCompAdminWillCreateAppUser: false,
      IsfreeVolAsPerTheDefInPolice1997: false,
    },
  })
  ApplicantBasic: IBasic;

  @ApiProperty({
    example: Role.EVIDENCE_CHECKER,
  })
  @IsNotEmpty()
  defaultRole: string;
}

export class CreateApplicationResponseDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      UserDetails: {
        userType: 'Evidence Checker',
        forename: 'Muhammad Ali',
        surname: 'Ahmed',
        username: 'afaq22',
        dateOfBirth: '12/09/1998',
        phone: '+923015586305',
        mobile: '+923015586305',
        email: 'example@example.com',
        postCode: '2s2d234',
        isUnderstoodDBSCodeOfPractice: true,
        isUnderstoodDBSIdChecking: true,
        isUnderstoodDBSIdcheckScenarios: true,
        isPersonHasFamiliarWithInfoOnDBS: true,
        electronicSignature: '54yhdfishg8745ythgie',
      },
    },
  })
  data: {
    UserDetails: {
      userType: string;
      forename: string;
      surname: string;
      username: string;
      dateOfBirth: string;
      phone: string;
      mobile: string;
      email: string;
      postCode: string;
      isUnderstoodDBSCodeOfPractice: boolean;
      isUnderstoodDBSIdChecking: boolean;
      isUnderstoodDBSIdcheckScenarios: boolean;
      isPersonHasFamiliarWithInfoOnDBS: boolean;
      electronicSignature: string;
    };
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
