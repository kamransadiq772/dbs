import { ApiResponseDto } from '../common/ApiResponse.dto';

export class DeleteRoleRequestDto {
  role: string;
}

export class DeleteRoleResponseDto extends ApiResponseDto {
  data: { role: string };
}
