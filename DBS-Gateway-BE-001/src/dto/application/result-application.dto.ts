import { ApiProperty } from '@nestjs/swagger';
import {
  IAdditionalDetails,
  IAddressDetails,
  IApplicationState,
  IIdentityCheck,
  IPersonalDetails,
  IPrimaryDocuments,
  IisNationalUK,
  IReviewInfo,
} from 'src/interfaces/application/applicationByCompanyAdmin.interface';
import { IEmploymentDetails } from 'src/interfaces/application/applicationByIndividual.interface';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class ResultApplicationRequestDto {
  @ApiProperty({
    example: {
      applicationId: '6399fb09bbc7a7f9f6e6a9e1',
    },
  })
  applicationId: string;
}

export class ResultApplicationResponseDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      ApplicationState: {
        isPaid: false,
        status: 'Rejected',
        stage: 'Rejected by Evidence Checker',
        comment: 'Rejected by Evidence Checker please check personalDetails',
        rejectedBy: '25f44227-781d-4d4d-ba72-c9d5207129c6',
        postedOn: '2022-12-15T12:54:26.557Z',
      },
    },
  })
  data: {
    applicationId: string;
    ApplicationState: {
      isPaid: false;
      status: string;
      stage: string;
      comment: string;
      rejectedBy: string;
      postedOn: string;
    };
  };

  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
