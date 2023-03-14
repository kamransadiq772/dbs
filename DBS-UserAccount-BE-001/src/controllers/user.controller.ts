import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '../dto/user/create-userr.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UserService } from '../services/user.service';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

    // @MessagePattern('add_user')
    // async addUser(@Payload() payload: CreateUserDto) {
    //     return await this.userService.addUser(payload)
    // }



    @MessagePattern('get_all_users_permissions')
    async getUsres() {
        return await this.userService.getUsers();
    }

    @MessagePattern('get_all_users_permissions_pagination')
    async getUsresPagination(@Payload() payload) {
        const {offset,limit}=payload
        return await this.userService.listUserPagination(offset,limit);
    }

    @MessagePattern('search_all_users_permissions_pagination')
    async searchUsresPagination(@Payload() payload) {
        const {searchTerm,offset,limit} = payload
        return await this.userService.searchUserPagination(searchTerm,offset,limit);
    }
    

    @MessagePattern('find_user_permissions_by_Id')
    async findOneById(@Payload() payload: { _id: string }) {
        console.log(payload);

        return await this.userService.findOneById(payload);
    }

    // @MessagePattern('all_users_with_applications')
    // async getAllUserswithApplications(@Payload() payload:{AdminID:any,offset:number,limit:number}){
    //     const {AdminID,offset,limit} = payload
    //     return await this.userService.getUserswithApplications(AdminID,offset,limit)
    // }

    @MessagePattern('delete_user_permissions')
    async deleteUser(@Payload() payload: { _id: string }) {
        return await this.userService.deleteUser(payload)
    }
    @MessagePattern('update_user_permissions')
    async updateUser(@Payload() payload: UpdateUserDto) {
        return await this.userService.updateUser(payload);
    }
    // @MessagePattern('resend_user_password')
    // async resendPassword(@Payload() payload:{email:string}){
    //     return await this.userService.resendPassword(payload)
    // }
}