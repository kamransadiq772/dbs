import { ApiResponseDto } from '../common/ApiResponse.dto';

export class RemovePermissionRequestDto {
  permissionId: string;
  role: string;
}

export class RemovePermissionResponseDto extends ApiResponseDto {
  data: { permissionId: string; role: string };
}
