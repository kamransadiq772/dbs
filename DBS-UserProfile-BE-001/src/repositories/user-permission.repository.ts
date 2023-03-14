import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../repositories/common/abstract.repository';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { UserPermission } from '../schemas/user.permission.schema';

@Injectable()
export class UserPermissionRepository extends AbstractRepository<UserPermission> {
    protected readonly logger = new Logger(UserPermissionRepository.name);

    constructor(
        @InjectModel(UserPermission.name) UserPermissionModel: Model<UserPermission>,
        @InjectConnection() connection: Connection,
    ) {
        super(UserPermissionModel, connection);
    }
}