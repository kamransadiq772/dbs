import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class ApplicationCertificatePostedOut extends ApiResponseDto {
  @ApiProperty({
    example: [
      {
        U_ID: 'c28d00d5-8784-45dd-99ea-cb2e9134eb9c',
        User: 'Muhammad Ali',
        A_ID: '63ac65754ff69b28741c9d73',
        NameInApplication: 'Muhammad Ali',
        DBS_APP_REF: 'DBS_APP_REF',
        DBS_APP_FROM_REF: 'DBS_APP_FROM_REF',
        DBS_Type: 'Enhanced',
        DisclosureStatus: 'Submit',
        CreatedAt: '2022-12-28T15:49:09.061Z',
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
