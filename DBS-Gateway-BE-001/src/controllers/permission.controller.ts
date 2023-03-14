import {
  Controller,
  Get,
  Inject,
  Query,
  Logger,
  UseInterceptors,
  Body,
  Post,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SERVICE } from '../constants';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ApiDescription } from '../shared/decorators/custom';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { CreateRoleRequestDto, CreateRoleResponseDto } from '../dto/role/create-role.dto';
import { CreatePwemissionRequestDto, } from '../dto/permission/create-permission.dto';
import { AssignPermissionRequestDto, } from '../dto/role/assign-permission.dto';

@ApiTags('Permissions')
@Controller('permission')
export class PermissionController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @Inject(SERVICE.USER_ACCOUNT) private permissionsClient: ClientRMQ
  ) { }

  @ApiDescription('Get Permissions')
  @ApiQuery({
    name: 'role',
    required: false,
  })
  @UseInterceptors(new TransformInterceptor())
  @Get('list')
  async list(@Query('role') role?: string) {
    if (!role) {
      return this.permissionsClient.send('get_permissions', {});
    } else {
      return this.permissionsClient.send('get_permissions_by_role', { role });
    }
  }

  @ApiCreatedResponse({
    type: CreateRoleResponseDto,
  })
  @Post('create')
  async create(@Body() dto: CreatePwemissionRequestDto) {
    return await this.permissionsClient.send('create_permission', dto);
  }


  @ApiCreatedResponse({
    type: AssignPermissionRequestDto,
  })
  @Post('assign_permission')
  async assignPermission(@Body() dto: AssignPermissionRequestDto) {
    return await this.permissionsClient.send('assign_permission', dto);
  }
}
