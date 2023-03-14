import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePermissionDto } from '../dto/permission/create-permission.dto';
// import { CreateRoleDto } from '../dto/permission/';
import {
  CheckPermissionRolesDto,
  AssignPermissionDto,
  GetPermissionsByRoleDto,
} from '../dto/permission';
import { Permission } from '../schemas/permission.schema';
import { PermissionService } from '../services/permission.service';
import { RoleService } from '../services/role.service';

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService, private readonly roleService: RoleService) { }


  // @MessagePattern('add_permissions')
  // async addPermissions(@Payload() payload: Permission[]) {
  //   return await this.permissionService.addPermissions(payload);
  // }

  @MessagePattern('get_permissions')
  async getPermissions() {
    return await this.permissionService.getPermissions();
  }

  @MessagePattern('get_permissions_by_role')
  async getPermissionsByRole(@Payload() payload: GetPermissionsByRoleDto) {
    return await this.permissionService.getPermissionsByRole(payload);
  }

  @MessagePattern('assign_permission')
  async assignPermission(@Payload() payload: AssignPermissionDto) {
    return await this.permissionService.assignPermission(payload);
  }

  // @MessagePattern('remove_permission')
  // async removePermissions(@Payload() payload: AssignPermissionDto) {
  //   return await this.permissionService.addPermissions(payload);
  // }

  @MessagePattern('check_permission_roles')
  async checkPermissionRoles(@Payload() payload: CheckPermissionRolesDto) {
    return await this.permissionService.checkPermissionRoles(payload);
  }
  @MessagePattern('create_permission')
  async createRole(@Payload() payload: CreatePermissionDto) {
    return await this.permissionService.createPermission(payload);
  }
}
