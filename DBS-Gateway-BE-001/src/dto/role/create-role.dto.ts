import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class CreateRoleRequestDto {
  @ApiProperty({
    example: 'HOST',
  })
  role: string;

  @ApiPropertyOptional({
    example: 1,
    nullable: true,
  })
  precedence?: number;

  @ApiPropertyOptional({
    example: [
      {
        id: "637cbf17d24c87bbfe1dfe1a",
        label: "profile_view"
      }
    ],
  })
  defaultPermissions: [];
}

export class CreateRoleResponseDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      role: 'HOST',
      precedence: 3,
    },
  })
  data: {
    role: string;
    precedence?: number;
    allowRoles: string[];
  };
}
