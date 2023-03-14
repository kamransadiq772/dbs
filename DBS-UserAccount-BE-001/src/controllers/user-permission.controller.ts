import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserPermissionDto } from '../dto/user-permission/user-permission-create.dto';
import { UserPermissionService } from '../services/user-permission.service';

@Controller()
export class UserPermissionController {
    constructor(private readonly userPermissionService: UserPermissionService) { }

    @MessagePattern('create_user_permission')
    async createUserPermission(@Payload() payload: CreateUserPermissionDto) {
        console.log(payload, "createUserPermission")
        return await this.userPermissionService.createUserPermission(payload);
    }
}
