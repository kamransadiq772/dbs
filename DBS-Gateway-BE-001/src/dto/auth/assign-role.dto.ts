// import { ApiResponseDto } from "../common/ApiResponse.dto";

import { ApiResponseDto } from "../common/ApiResponse.dto";

export class AssignRoleRequestDto {
    userId: string;
    groupName: string;
}

export class AssignRoleResponseDto extends ApiResponseDto{
    userId: string;
    groupName: string;
}