import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class ApplicationToBeReviewed extends ApiResponseDto {
  @ApiProperty({
    example: [
      {
        U_ID: 'e5608a91-02e4-441d-8248-86a9a8d4bb18',
        User: 'Muhammad Ali Khan',
        Evidence_Checker: 'Evidence_Checker',
        Company: 'Orcalo',
        DBS_Type: 'Enhanced',
        Profession: 'Carer',
        CreatedAt: '2022-12-23T11:47:13.471Z',
        Status: 'Compl',
      },
      {
        U_ID: 'c575482d-1663-4c35-9bcf-735bf9ba3975',
        User: 'Muhammad Ali',
        Evidence_Checker: 'Evidence_Checker',
        Company: 'Orcalo',
        DBS_Type: 'Enhanced',
        Profession: 'Carer',
        CreatedAt: '2022-12-20T17:25:54.386Z',
        Status: 'Pending',
      },
      {
        U_ID: 'e5608a91-02e4-441d-8248-86a9a8d4bb18',
        User: 'Muhammad Ali',
        Evidence_Checker: 'Evidence_Checker',
        Company: 'Orcalo',
        DBS_Type: 'Enhanced',
        Profession: 'Carer',
        CreatedAt: '2022-12-19T13:48:07.684Z',
        Status: 'Pending',
      },
      {
        U_ID: 'e5608a91-02e4-441d-8248-86a9a8d4bb18',
        User: 'Muhammad Ali',
        Evidence_Checker: 'Evidence_Checker',
        Company: 'Orcalo',
        DBS_Type: 'Enhanced',
        Profession: 'Carer',
        CreatedAt: '2022-12-13T15:16:08.127Z',
        Status: 'Rejected',
      },
      {
        U_ID: 'e5608a91-02e4-441d-8248-86a9a8d4bb18',
        User: 'Muhammad Wahab Khan',
        Evidence_Checker: 'Evidence_Checker',
        Company: 'Orcalo RWP UK LHR',
        DBS_Type: 'Enhanced',
        Profession: 'Carer',
        CreatedAt: '2022-12-13T15:00:26.074Z',
        Status: 'Pending',
      },
    ],
  })
  data: [];

  @ApiProperty({ example: 'success' })
  message: string;

  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 0 })
  offset: number;

  @ApiProperty({ example: 5 })
  limit: number;
}
