import { ApiProperty } from "@nestjs/swagger";
import { ApiResponseDto } from "../common/ApiResponse.dto";

export class AssignRoleRequestDto {
    @ApiProperty({ example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
    userId: string;
    @ApiProperty({ example: 'INDIVIDUAL_USER' })
    role: string;
}

export class AssignRoleResponseDto extends ApiResponseDto {
    @ApiProperty({ example: 'Role assigned successfully' })
    message: string;
}