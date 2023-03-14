// import { IUser } from '../../interfaces/user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class GetUserRequestDto {
  userId: string;
}
export class GetUserPaginationRequestDto {
  @ApiProperty({ example: 0 })
  offset: number
  @ApiProperty({ example: 10 })
  limit: number
}
export class SearchUserPaginationRequestDto {
  @ApiProperty({ example: "kam" })
  searchTerm: string
  @ApiProperty({ example: 0 })
  offset: number
  @ApiProperty({ example: 5 })
  limit: number
}
export class getUserswithApplications {
  // @ApiProperty({example:"4f0bdf55-be9e-4c45-a1cd-15e642f69006"})
  AdminID: string
  @ApiProperty({ example: 0 })
  offset?: number
  @ApiProperty({ example: 10 })
  limit?: number
  @ApiPropertyOptional({ example: 'aa' })
  searchTerm?: string
  @ApiPropertyOptional({ example: 'username' })
  sortby?: string
  @ApiPropertyOptional({ example: -1 })
  sort?: number
}
export class GetUserResponseDto extends ApiResponseDto { }
export class getSubUsersOfCompany {
    // @ApiProperty({example:"4f0bdf55-be9e-4c45-a1cd-15e642f69006"})
    reqUser: string
    @ApiPropertyOptional({ example: 0 })
    offset?: number
    @ApiPropertyOptional({ example: 10 })
    limit?: number
    @ApiPropertyOptional({ example: 'username' })
    sortby?: string
    @ApiPropertyOptional({ example: -1 })
    sort?: number
    @ApiPropertyOptional({ example: 'aa' })
    searchTerm?: string
    type?:Array<string>
    role?:string;
    @ApiPropertyOptional({ example: true })
    assigned?:boolean;
    @ApiPropertyOptional({ example: true })
    active?: boolean;
    @ApiPropertyOptional({ example: 100000 })
    from?: number;
    @ApiPropertyOptional({ example: 2670864726 })
    to?: number;
}

export class GetSingleUser{
  @ApiProperty({ example: '6030635f-326e-4030-92c6-06d7ab3eff8d' })
  id:string
}
