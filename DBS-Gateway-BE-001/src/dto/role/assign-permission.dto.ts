import { ApiResponseDto } from '../common/ApiResponse.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignPermissionRequestDto {
  @ApiPropertyOptional({
    example: '635127769df31c64672e450c',
  })
  permissionId: string;

  @ApiPropertyOptional({
    example: 'application_create',
  })
  label: string;

  @ApiPropertyOptional({
    example: 'INDIVIDUAL_USER',
  })
  role: string;
}

export class AssignPermissionResponseDto extends ApiResponseDto {
  data: { permissionId: string; label: string };
}
