import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import {
  CreateGroupRequest,
  DeleteGroupRequest,
  UpdateGroupRequest,
  ListGroupsRequest,
  GetGroupRequest,
  AdminAddUserToGroupRequest,
  AdminRemoveUserFromGroupRequest,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import {
  CreateRoleDto,
  DeleteRoleDto,
  GetRoleDto,
  UpdateRoleDto,
  ListRolesDto,
  AssignRoleDto,
} from '../dto/role';
import { RoleRepository } from "../repositories/role.repository"

@Injectable()
export class RoleService {
  protected readonly logger = new Logger('AUTH_MICROSERVICE');

  constructor(
    private roleRepository: RoleRepository,
    private config: ConfigService,
    @Inject('CognitoIDP') private cognitoIDP: CognitoIdentityServiceProvider,

  ) { }

  async listRoles({ limit }: ListRolesDto) {
    const params: ListGroupsRequest = {
      UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
      Limit: limit,
    };
    try {
      const response = await this.cognitoIDP.listGroups(params).promise();
      return response.Groups
    } catch (e) {
      throw new RpcException(e.message)
    }
  }

  async getRole({ role }: GetRoleDto) {
    const params: GetGroupRequest = {
      UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
      GroupName: role,
    };
    const response = await this.cognitoIDP.getGroup(params).promise();
    return response.Group;
  }

  // async createRole({ role, precedence, description, defaultPermissions }: CreateRoleDto) {
  //   try {
  //     const checkrole = await this.roleRepository.find({ role: role })
  //     // console.log("CHECKROLE", checkrole, "----END");


  //     if (!checkrole) {
  //       try {
  //         const params: CreateGroupRequest = {
  //           GroupName: role,
  //           UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
  //           Precedence: precedence,
  //           Description: description
  //         };
  //         const cognitoResponse = await this.cognitoIDP.createGroup(params).promise();

  //         let a = await this.roleRepository.create({ role, precedence, defaultPermissions })
  //         console.log("-----a-----", a, "----a-----")
  //         return cognitoResponse
  //       } catch (err) {
  //         console.log(err);
  //         throw new RpcException(err);
  //       }


  //     } else {
  //       return {
  //         message: "Already exits please update the role"
  //       }
  //     }
  //   } catch (err) {
  //     return err
  //   }


  async createRole({ role, precedence, defaultPermissions }: CreateRoleDto) {
    // try {
    // const checkrole = await this.roleRepository.find({ role: role })
    // console.log("CHECKROLE", checkrole, "----END");


    // if (!checkrole) {
    try {
      const params: CreateGroupRequest = {
        GroupName: role,
        UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
        Precedence: precedence
      };
      const cognitoResponse = await this.cognitoIDP.createGroup(params).promise();

      await this.roleRepository.create({ role, precedence, defaultPermissions })

      return cognitoResponse
    } catch (err) {
      console.log(err);
      throw new RpcException(err);
    }


    // } else {
    //   return {
    //     message: "Already exits please update the role"
    //   }
    // }
    // } catch (err) {
    //   return err
    // }

  }

  async updateRole({ userId, ...user }: UpdateRoleDto) {
    const params: UpdateGroupRequest = {
      GroupName: user.role,
      UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
      Precedence: user.precedence,
      Description: user.description,
    };
    const response = await this.cognitoIDP.updateGroup(params).promise();
    await this.roleRepository.findOneAndUpdate({ _id: userId }, user)

    return response
  }

  async deleteRole({ userId, role }: DeleteRoleDto) {
    const params: DeleteGroupRequest = {
      GroupName: role,
      UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
    };
    const response = await this.cognitoIDP.deleteGroup(params).promise();

    await this.roleRepository.delete({ _id: userId })

    return response
  }

  async assignRoleToUser({ userId, role }: AssignRoleDto) {
    const params: AdminAddUserToGroupRequest = {
      Username: userId,
      GroupName: role,
      UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
    };
    return await this.cognitoIDP.adminAddUserToGroup(params).promise();
  }

  async removeRoleOfUser({ userId, role }: AssignRoleDto) {
    const params: AdminRemoveUserFromGroupRequest = {
      Username: userId,
      GroupName: role,
      UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
    };
    return await this.cognitoIDP.adminRemoveUserFromGroup(params).promise();
  }
}
