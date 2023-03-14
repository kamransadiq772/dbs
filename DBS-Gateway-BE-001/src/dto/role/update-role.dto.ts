import { ApiResponseDto } from '../common/ApiResponse.dto';

export class UpdateRoleRequestDto {
  role: string;
  precedence?: number;
}

export class UpdateRoleResponseDto extends ApiResponseDto {
  data: { role: string; precedence?: number };
}
