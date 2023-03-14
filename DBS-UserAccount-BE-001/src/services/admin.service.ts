import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import CognitoIdentityServiceProvider, { AdminAddUserToGroupRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import _ from "lodash";
import { AssignRoleDto } from 'src/dto/admin/assign-role.dto';

@Injectable()
export class AdminService {
    protected readonly logger = new Logger(AdminService.name)

    constructor(
        private config: ConfigService,
        @Inject('CognitoIDP') private congnitoIDP: CognitoIdentityServiceProvider,
    ) { }

    async assignRoleToUser({ userId, role }: AssignRoleDto) {
        try {
            const params: AdminAddUserToGroupRequest = {
                Username: userId,
                GroupName: role,
                UserPoolId: this.config.get('COGNITO_USERPOOL_ID')
            };
            const cognitoRes = await this.congnitoIDP.adminAddUserToGroup(params).promise();
            this.logger.debug(cognitoRes)
            return {
                data: null,
                message: "Role assigned to the user successfully.",
                errors: null,
            }
        } catch (err) {
            throw new RpcException(err);
        }
    }
}