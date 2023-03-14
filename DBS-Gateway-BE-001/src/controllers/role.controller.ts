import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Logger,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { SERVICE } from '../constants';
import { ApiDescription, Permission } from '../shared/decorators/custom';
import {
  AssignPermissionRequestDto,
  CreateRoleRequestDto,
  CreateRoleResponseDto,
  DeleteRoleRequestDto,
  RemovePermissionRequestDto,
  UpdateRoleRequestDto,
} from '../dto/role';
import { Role } from '../interfaces/role';

class INTERNAL_SERVER_ERROR {
  @ApiProperty({ example: 500 })
  status: number;
}
@ApiInternalServerErrorResponse({
  type: INTERNAL_SERVER_ERROR,
})
@ApiTags('Roles')
@Controller('role')
export class RoleController {
  private readonly logger = new Logger('Gateway Role Controller')
  constructor(
    @Inject(SERVICE.USER_ACCOUNT) private roleClient: ClientRMQ,
    @Inject(SERVICE.USER_PROFILE) private permissionsClient: ClientRMQ,
  ) { }

  // @Roles(Role.HOST, Role.GUEST)
  @Get('list')
  async list(@Query('limit') limit?: number) {
    return await this.roleClient.send('list_roles', { limit });
  }

  @Get('get/:role')
  async get(@Param('role') role: string) {
    return await this.roleClient.send('get_role', { role });
  }

  @ApiCreatedResponse({
    type: CreateRoleResponseDto,
  })
  @Post('create')
  async create(@Body() dto: CreateRoleRequestDto) {
    return await this.roleClient.send('create_role', dto);
  }

  @Put('update')
  async update(@Body() dto: UpdateRoleRequestDto) {
    return await this.roleClient.send('update_role', dto);
  }

  @Delete('delete')
  async delete(@Body() dto: DeleteRoleRequestDto) {
    return await this.roleClient.send('delete_role', dto);
  }

  @ApiDescription('Assign a Permission to a role')
  @Post('assign-permission')
  async assignPermission(@Body() dto: AssignPermissionRequestDto) {
    return await this.permissionsClient.send('assign_permission', { ...dto });
  }

  @ApiDescription('Remove a Permission to a role')
  @Post('remove-permission')
  async removePermission(@Body() dto: RemovePermissionRequestDto) {
    return await this.permissionsClient.send('remove_permission', { ...dto });
  }
}
