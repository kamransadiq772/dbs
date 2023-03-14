import { Injectable, Logger } from '@nestjs/common';
import { PermissionRepository } from '../repositories/permission.repository';
import { RoleRepository } from '../repositories/role.repository';
//import { UserPermissionRepository } from '../repositories/user-permission.repository';
import { UserPermissionRepository } from '../repositories/user-permission.repository';
import { Permission } from '../schemas/permission.schema';
import _ from 'lodash';
import {
  AssignPermissionDto,
  CheckPermissionRolesDto,
} from '../dto/permission';
import { RpcException } from '@nestjs/microservices';
import { CreatePermissionDto } from '../dto/permission/create-permission.dto';
//import { RoleRepository } from '../repositories/role.repository';


@Injectable()
export class PermissionService {
 // constructor(private permissionRepository: PermissionRepository, private roleRepository: RoleRepository) { }
  // constructor(
  //   private permissionRepository: PermissionRepository,
  //   private roleRepository: RoleRepository,
  //  private userPermissionRepository: UserPermissionRepository,
  // ) {}
  // async addPermissions(document: any) {
  //   let ops: Permission[] = [];
  //   Object.values(document.paths).forEach((methods) => {
  //     Object.keys(methods).forEach((method) => {
  //       ops.push({
  //         permissionId: methods[method].operationId,
  //         description: methods[method].description || '',
  //         allowedRoles:
  //           (methods[method]?.summary?.length !== 0 &&
  //             methods[method]?.summary?.split('|')) ||
  //           [],
  //       });
  //     });
  //   });
  //   const dbOpsWithIds = await this.permissionRepository.find();
  //   const dbOps = dbOpsWithIds.map((o) => {
  //     delete o._id;
  //     return o;
  //   });
  constructor(
    private permissionRepository: PermissionRepository,
    private roleRepository: RoleRepository,
    private userPermissionRepository: UserPermissionRepository,
  ) {}
  // async addPermissions(document: any) {
  //   let ops: Permission[] = [];
  //   Object.values(document.paths).forEach((methods) => {
  //     Object.keys(methods).forEach((method) => {
  //       ops.push({
  //         permissionId: methods[method].operationId,
  //         description: methods[method].description || '',
  //         allowedRoles:
  //           (methods[method]?.summary?.length !== 0 &&
  //             methods[method]?.summary?.split('|')) ||
  //           [],
  //       });
  //     });
  //   });
  //   const dbOpsWithIds = await this.permissionRepository.find();
  //   const dbOps = dbOpsWithIds.map((o) => {
  //     delete o._id;
  //     return o;
  //   });

  async addPermissions({ permissionId, role }: AssignPermissionDto) {
    // let ops: Permission[] = [];
    // Object.values(document.paths).forEach((methods) => {
    //   Object.keys(methods).forEach((method) => {
    //     ops.push({
    //       permissionId: methods[method].operationId,
    //       description: methods[method].description || '',
    //       allowedRoles:
    //         (methods[method]?.summary?.length !== 0 &&
    //           methods[method]?.summary?.split('|')) ||
    //         [],
    //     });
    //   });
    // });
    // const dbOpsWithIds = await this.permissionRepository.find();
    // const dbOps = dbOpsWithIds.map((o) => {
    //   delete o._id;
    //   return o;
    // });

    // const newOps = _(ops).differenceWith(dbOps, _.isEqual).toJSON();
    // const uniqueOps = _(ops).xorWith(dbOps, _.isEqual).toJSON();
    // const oldOps = _(uniqueOps).differenceWith(newOps, _.isEqual).toJSON();

    // const isUpdated = !_(newOps).isEmpty();
    // try {
    //   if (dbOpsWithIds.length === 0 || !!isUpdated) {
    //     oldOps.forEach(async (o) => {
    //       await this.permissionRepository.delete({
    //         permissionId: o.permissionId,
    //       });
    //     });
    //     await this.permissionRepository.batchCreate(newOps, {
    //       ordered: true,
    //     });
    //   }
    //   return true;

    try {

      const res = await this.permissionRepository.find({ permissionId })
      // console.log(res)

    } catch (err) {
      return new RpcException(err);
    }
  }

  async getPermissions() {
    return await this.permissionRepository.find({}, { _id: 0 });
  }

  async getPermissionsByRole(dto: { role: string }) {
    const { role } = dto;
    return await this.permissionRepository.find(
      { allowedRoles: role },
      { _id: 0 },
    );
  }

  async assignPermission(dto: AssignPermissionDto) {
    const { permissionId, role, label } = dto;

    return await this.roleRepository.findOneAndUpdate(
      { role },
      {
        $push: { defaultPermissions: { id: permissionId, label: label } },
      },
    );
  }

  async removePermission(dto: AssignPermissionDto) {
    const { permissionId, role } = dto;
    return await this.permissionRepository.findOneAndUpdate(
      { permissionId },
      {
        $pull: { allowedRoles: role },
      },
    );
  }


  // async checkPermissionRoles({
  //   controllerKey,
  //   methodKey,
  // }: CheckPermissionRolesDto) {
  //   return (
  //     await this.permissionRepository.findOne({
  //       permissionId: `${controllerKey.replace('Controller', '')}.${
  //         methodKey.charAt(0).toUpperCase() + methodKey.slice(1)
  //       }`,
  //     })
  //   ).allowedRoles;
  // }

  async createPermission({ permission, label, module }: CreatePermissionDto) {
    try {



      //  const params: CreateGroupRequest = {
      //    GroupName: role,
      //    UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
      //    Precedence: precedence,
      //    Description: description
      //  };
      //  const cognitoResponse = await this.cognitoIDP.createGroup(params).promise();

      await this.permissionRepository.create({ module, permission, label })

      return {
        message: "Already exits please update the role"
      }
    } catch (err) {
      console.log(err);
      throw new RpcException(err);
    }
  }
  async checkPermissionRoles({ userId, label }: CheckPermissionRolesDto) {
    Logger.debug(label, 'label');

    Logger.debug(userId, 'DASDASDDA');

    const userPermissionObject = await this.userPermissionRepository.findOne({
      userId,
    });

    const permissions = userPermissionObject.allowedPermissions;

    const perArr: any = permissions;

    for (const permission of perArr) {
      if (permission.label === label) {
        console.log('permission.label matched');
        return true;
      }
    }

    return {
      message: 'test',
    };
  }
  // async checkPermissionRoles({ userId, label }: CheckPermissionRolesDto) {
  //   Logger.debug(label, 'label');

  //   Logger.debug(userId, 'DASDASDDA');

  //   const userPermissionObject = await this.userPermissionRepository.findOne({
  //     userId,
  //   });

  //   const permissions = userPermissionObject.allowedPermissions;

  //   const perArr: any = permissions;

  //   for (const permission of perArr) {
  //     if (permission.label === label) {
  //       console.log('permission.label matched');
  //       return true;
  //     }
  //   }

  //   return {
  //     message: 'test',
  //   };
  // }


}
