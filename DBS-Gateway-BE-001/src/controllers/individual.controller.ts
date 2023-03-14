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
import { Role } from '../interfaces/role';
import { SERVICE } from '../constants';
import {
  CreateIndividualRequestDto,
  CreateIndividualResponseDto,
  UpdateIndividualRequestDto,
  UpdateIndividualResponseDto
} from '../dto/user';
import { Permission } from '../shared/decorators/custom';
import { AssignRoleResponseDto, AssignRoleRequestDto } from '../dto/user/assign-role-individual.dto';
import { AuthN } from '../shared/decorators/authN.decorator';

@ApiTags('Individual')
@Controller('individual')

export class IndividualController {
  constructor(
    @Inject(SERVICE.USER_PROFILE) private userClient: ClientRMQ,
    @Inject(SERVICE.USER_ACCOUNT) private adminAuthClient: ClientRMQ,) { }

  @Get('list')
  async list() {
    return this.userClient.send('list_individuals', {});
  }

  // @Permission("profile_view")
  // @Get('get/:userId')
  // async get(@Param('userId') userId: string) {
  //   return this.userClient.send('get_individual', { userId });
  // }

  @Permission("profile_view")
  @Get('get')
  @AuthN()
  async get(@Req() req) {
    const indId = req.user.userId
    return this.userClient.send('get_individual', { userId: indId });
  }

  @ApiCreatedResponse({
    type: CreateIndividualResponseDto,
  })
  @Post('create')
  async create(@Body() dto: CreateIndividualRequestDto) {
    return this.userClient.send('create_individual', dto);
  }

  // @Permission("profile_edit")
  // @ApiCreatedResponse({
  //   type: UpdateIndividualResponseDto,
  // })
  // @Put('update')
  // async update(@Body() dto: UpdateIndividualRequestDto) {
  //   return this.userClient.send('update_individual', dto);
  // }

  @Permission("profile_edit")
  @ApiCreatedResponse({
    type: UpdateIndividualResponseDto,
  })
  @Patch('update')
  @AuthN()
  async update(@Req() req, @Body() dto: UpdateIndividualRequestDto) {

    delete dto.email;

    const indId = req.user.userId
    dto.userId = indId
    return this.userClient.send('update_individual', dto);
  }

  @Delete('delete/:userId')
  async delete(@Param('userId') userId: string) {
    return this.userClient.send('delete_individual', { userId });
  }

  @Post('assign-role')
  @ApiCreatedResponse({
    type: AssignRoleResponseDto
  })
  async assignRole(@Body() dto: AssignRoleRequestDto) {
    return this.adminAuthClient.send('admin_assign_role', dto)
  }
}
