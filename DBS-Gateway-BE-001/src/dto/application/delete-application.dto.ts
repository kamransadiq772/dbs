import { ApiResponseDto } from '../common/ApiResponse.dto';

export class DeleteApplicationRequestDto {
  _id: string;
}

export class DeleteApplicationResponseDto extends ApiResponseDto {
  data: { id: string };
}
