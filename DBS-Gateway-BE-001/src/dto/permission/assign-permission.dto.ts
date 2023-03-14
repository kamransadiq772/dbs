import { ApiResponseDto } from '../common/ApiResponse.dto';

export class AssignPermissionRequestDto {
  permissionId: string;
  role: string;
}

export class AssignPermissionResponseDto extends ApiResponseDto {
  data: { permissionId: string; role: string };
}
