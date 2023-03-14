import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ListRolesDto,
  GetRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
  DeleteRoleDto,
  RemoveRoleDto,
  AssignRoleDto,
} from '../dto/role';
import { RoleService } from '../services/role.service';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern('list_roles')
  async listRoles(@Payload() payload: ListRolesDto) {
    return await this.roleService.listRoles(payload);
  }

  @MessagePattern('get_role')
  async getRole(@Payload() payload: GetRoleDto) {
    return await this.roleService.getRole(payload);
  }

  @MessagePattern('create_role')
  async createRole(@Payload() payload: CreateRoleDto) {
    return await this.roleService.createRole(payload);
  }

  @MessagePattern('update_role')
  async updateRole(@Payload() payload: UpdateRoleDto) {
    return await this.roleService.updateRole(payload);
  }

  @MessagePattern('delete_role')
  async deleteRole(@Payload() payload: DeleteRoleDto) {
    return await this.roleService.deleteRole(payload);
  }

  @MessagePattern('assign_role')
  async assignRole(@Payload() payload: AssignRoleDto) {
    return await this.roleService.assignRoleToUser(payload);
  }

  @MessagePattern('remove_role')
  async removeRole(@Payload() payload: RemoveRoleDto) {
    return await this.roleService.removeRoleOfUser(payload);
  }
}
