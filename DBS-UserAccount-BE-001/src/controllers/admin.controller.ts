import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SignupDto } from '../dto/auth/sign-up.dto';
import { AssignRoleDto } from '../dto/admin/assign-role.dto';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';


@Controller()
export class AdminController {
    constructor(private readonly adminService: AdminService,
   private readonly authService: AuthService) { }
        //private readonly authService: AuthService) { }


    @MessagePattern('admin_assign_role')
    async assignRole(@Payload() payload: AssignRoleDto) {
        console.log(payload, "assignRole")
        return await this.adminService.assignRoleToUser(payload);
    }
    @MessagePattern('create_user_admin')
    async createUser(@Payload() payload: SignupDto) {
        // const { email} = payload
        // console.log("AdminConttroller",email,"");
    
        const { email } = payload
        console.log("AdminConttroller", email, "");

        return await this.authService.signup(payload);
    }
    // @MessagePattern('admin_assign_role')
    // async assignRole(@Payload() payload: AssignRoleDto) {
    //     return await this.adminService.assignRoleToUser(payload);
    // }
    // @MessagePattern('admin_assign_role')
    // async assignRole(@Payload() payload: AssignRoleDto) {
    //     return await this.adminService.assignRoleToUser(payload);
    // }
    // @MessagePattern('admin_assign_role')
    // async assignRole(@Payload() payload: AssignRoleDto) {
    //     return await this.adminService.assignRoleToUser(payload);
    // }
}