import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { UserPermission } from '../schemas/userpermission.schema.t';
import { User } from "../schemas/user.schema";
import { AbstractRepository } from "./common/abstract.repository";

@Injectable()
export class UserRepository extends AbstractRepository<UserPermission>{

    protected readonly logger = new Logger(UserRepository.name);

    constructor(
        @InjectModel(UserPermission.name) userPermissionModel: Model<UserPermission>,
        @InjectConnection() connection: Connection
    ) {
        super(userPermissionModel, connection)
    }

}