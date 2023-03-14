import { ApiResponseDto } from "../common/ApiResponse.dto";

export class VerifyTokenRequestDto {
  authToken: string;
}

export class VerifyTokenResponseDto extends ApiResponseDto{
  authToken: string;
}
