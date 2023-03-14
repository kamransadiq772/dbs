import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class ResultApplicationAlreadyPaidForResponseDto extends ApiResponseDto {
  @ApiProperty({
    example: [
      {
        U_ID: 'e5608a91-02e4-441d-8248-86a9a8d4bb18',
        User: 'MR Muhammad Ali Khan PresentSurname',
        A_ID: '63a5954183f65b7e6db7b2df',
        NameInApplication: 'MR Muhammad Ali Khan PresentSurname',
        TotalVatable: 0,
        TotalNonVatable: 0,
        TotalVat: 0,
        TotalPaid: 0,
        CreatedAt: '2022-12-23T11:47:13.471Z',
      },
      {
        U_ID: 'c575482d-1663-4c35-9bcf-735bf9ba3975',
        User: 'MISS/MR Muhammad Ali PresentSurname',
        A_ID: '63a1f02295ac2eff5f856e81',
        NameInApplication: 'MISS/MR Muhammad Ali PresentSurname',
        TotalVatable: 0,
        TotalNonVatable: 0,
        TotalVat: 0,
        TotalPaid: 0,
        CreatedAt: '2022-12-20T17:25:54.386Z',
      },
      {
        U_ID: 'e5608a91-02e4-441d-8248-86a9a8d4bb18',
        User: 'MISS/MR Muhammad Ali PresentSurname',
        A_ID: '63a06b970d0dac0ba27f1065',
        NameInApplication: 'MISS/MR Muhammad Ali PresentSurname',
        TotalVatable: 0,
        TotalNonVatable: 0,
        TotalVat: 0,
        TotalPaid: 0,
        CreatedAt: '2022-12-19T13:48:07.684Z',
      },
      {
        U_ID: 'e5608a91-02e4-441d-8248-86a9a8d4bb18',
        User: 'MISS/MR Muhammad Ali PresentSurname',
        A_ID: '639897380e719fb01ef34fd8',
        NameInApplication: 'MISS/MR Muhammad Ali PresentSurname',
        TotalVatable: 0,
        TotalNonVatable: 0,
        TotalVat: 0,
        TotalPaid: 0,
        CreatedAt: '2022-12-13T15:16:08.127Z',
      },
      {
        U_ID: 'e5608a91-02e4-441d-8248-86a9a8d4bb18',
        User: 'MISS/MR Muhammad Wahab Khan PresentSurname',
        A_ID: '6398938a248141a2b0d38dc5',
        NameInApplication: 'MISS/MR Muhammad Wahab Khan PresentSurname',
        TotalVatable: 0,
        TotalNonVatable: 0,
        TotalVat: 0,
        TotalPaid: 0,
        CreatedAt: '2022-12-13T15:00:26.074Z',
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
