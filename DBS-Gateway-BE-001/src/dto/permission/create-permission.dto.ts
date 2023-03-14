import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class CreatePwemissionRequestDto {
  @ApiProperty({
    example: 'application',
  })
  module: string;

  @ApiPropertyOptional({
    example: 'create dbs application',
  })
  permission: string;

  @ApiPropertyOptional({
    example: "application_create",
  })
  label: string;
}

export class CreateRoleResponseDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      module: 'application',
      permission: "create dbs application",
      label: "application_create",

    },
  })
  data: {
    label: string;
    permission: string;
    module: string;
  };
}
