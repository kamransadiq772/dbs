import { ApiResponseDto } from '../common/ApiResponse.dto';
import { ApiProperty } from '@nestjs/swagger';
export class SignOutRequestDto {
  @ApiProperty({
    example: 'eyJraWQiOiJ3dyt6NERNMVRmT001dmdpZjBLckx1WlE3b0dGV1Q3VVh0OGJMclwvTUo5Yz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxNWY4NDE1Yy1hMTk1LTQyMWItOTUzYS04MzNmMWRlYjg2NWQiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMl82UU5KbTRlWFIiLCJjbGllbnRfaWQiOiI1djRwMjVhdWY2amlpMXY1ZWVlOTgwOHM0YyIsIm9yaWdpbl9qdGkiOiI0M2FiZjEwMC0wYWM4LTRjYmYtYWU3NC0zYTE0ZGU5NDFmYmYiLCJldmVudF9pZCI6ImI0MjBjZDZiLTAwOGMtNDM4NS1hOWNkLTY1MmYxYTE2NjJlZSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2NjY3MTAxNDksImV4cCI6MTY2NjcxMzc0OSwiaWF0IjoxNjY2NzEwMTQ5LCJqdGkiOiJlOGY0MDEzZS1kYjFlLTQ0YjUtYjA4OS1jMDJlOGI1YTNhYWYiLCJ1c2VybmFtZSI6IjE1Zjg0MTVjLWExOTUtNDIxYi05NTNhLTgzM2YxZGViODY1ZCJ9.gF9f8PWgG3r-gpm0ka7LyV2nx_6ZXZuGr3c8EajwLTje5x_FSCkbKrow_Kkka27Gz7hoWozErMYvREs071CCI3cVtYjRi7OYq1olnUEbNQ73zv7Jl93Fnu8H--2wGK1dp8fljqW33HjsbO874jczWfoxZwlEerXwhfEdcng3eMjocgic-M5WVT2dpAnVI0kh3mvpq7CJFDN6q9uDI16aWBgNP6uYb9TzvJrSMSU30yaf0lualJayLQpK2YLsuB9oMVvHiG2Z2q78n44lBjIbV_jaeXyPHU_9nS5fZflWJtz2Cxw1oWusZdbJW4byZBQd2kS9e5JNV9X2a6qDErQ8cg',
  })
  accessToken: string;
}

export class SignOutResponseDto extends ApiResponseDto {
  message: 'Logged out successfully.';
}
