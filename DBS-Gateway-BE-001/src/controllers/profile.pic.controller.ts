import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ClientRMQ, RpcException } from '@nestjs/microservices';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { SERVICE } from '../constants';
import { AuthN } from '../shared/decorators/authN.decorator';
import { CreateProfilePicRequestDto } from '../dto/profile-pic/create.profile.pic';

@ApiTags('ProfilePic')
@Controller('profilePic')
export class ProfilePicController {
  constructor(@Inject(SERVICE.USER_PROFILE) private userClient: ClientRMQ) {}

  @ApiCreatedResponse({
    type: CreateProfilePicRequestDto,
  })
  @AuthN()
  @Post('create')
  async create(
    @Req() { user: { userId } },
    @Body() dto: CreateProfilePicRequestDto,
  ) {
    dto.userId = userId;
    console.log(dto);
    return this.userClient.send('upload_profile_pic', dto);
  }

  @ApiCreatedResponse({
    type: CreateProfilePicRequestDto,
  })
  @AuthN()
  @Patch('update')
  async update(
    @Req() { user: { userId } },
    @Body() dto: CreateProfilePicRequestDto,
  ) {
    dto.userId = userId;
    console.log(dto);
    return this.userClient.send('update_profile_pic', dto);
  }

  @ApiCreatedResponse({
    type: CreateProfilePicRequestDto,
  })
  @AuthN()
  @Get('get')
  async get(@Req() { user: { userId } }) {
    console.log(userId);
    return this.userClient.send('get_profile_pic', userId);
  }

  @ApiCreatedResponse({
    type: CreateProfilePicRequestDto,
  })
  @AuthN()
  @Delete('delete')
  async delete(@Req() { user: { userId } }) {
    console.log(userId);
    return this.userClient.send('delete_profile_pic', userId);
  }
}
