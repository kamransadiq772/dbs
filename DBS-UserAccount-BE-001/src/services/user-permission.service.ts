import { Injectable, Logger } from '@nestjs/common';
import { UserPermissionRepository } from '../repositories/user-permission.repository';
import { RoleRepository } from "../repositories/role.repository"
import {
    CreateUserPermissionDto
} from "../dto/user-permission/user-permission-create.dto";
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserPermissionService {
    constructor(private userPermissionRepository: UserPermissionRepository,
        private roleRepository: RoleRepository) { }

    // async listCompanyUsers(dto: ListCompanysDto) {
    //     try {
    //         let users = await this.userPermissionRepository.find();
    //         users = users.map((user) => {
    //             const { _id: userId, ...data } = user;
    //             return Object.assign({ userId }, Object(data));
    //         });
    //         return {
    //             data: users,
    //             message: '',
    //             errors: null,
    //         };
    //     } catch (err) {
    //         throw new RpcException(err);
    //     }
    // }

    // async getCompanyUser(dto: GetCompanyDto) {
    //     try {
    //         const { userId } = dto;
    //         const user = await this.userPermissionRepository.findOne({ _id: userId });
    //         const { _id, ...data } = user;
    //         return {
    //             data: Object.assign({ userId }, Object(data)),
    //             message: '',
    //             errors: null,
    //         };
    //     } catch (err) {
    //         throw new RpcException(err);
    //     }
    // }

    async createUserPermission(dto: CreateUserPermissionDto) {
        try {
            const { userId, role } = dto

            const getRole = await this.roleRepository.find({ role })

            const [aRole]: any = getRole

            const allowedPermission: any = aRole.defaultPermissions

            await this.userPermissionRepository.create({ userId, role, allowedPermissions: allowedPermission });
            return {
                data: null,
                message: 'Default permission added successfully.',
                errors: null,
            };
        } catch (err) {
            throw new RpcException(err);
        }
    }

    // async updateCompanyUser(dto: UpdateCompanyDto) {
    //     try {
    //         const { userId, ...user } = dto;
    //         await this.userPermissionRepository.findOneAndUpdate({ _id: userId }, user);
    //         return {
    //             data: null,
    //             message: 'User updated successfully.',
    //             errors: null,
    //         };
    //     } catch (err) {
    //         throw new RpcException(err);
    //     }
    // }

    // async deleteCompanyUser(dto: DeleteCompanyDto) {
    //     try {
    //         const { userId } = dto;
    //         await this.userPermissionRepository.delete({ _id: userId });
    //         return {
    //             data: null,
    //             message: 'User deleted successfully.',
    //             errors: null,
    //         };
    //     } catch (err) {
    //         throw new RpcException(err);
    //     }
    // }
}
