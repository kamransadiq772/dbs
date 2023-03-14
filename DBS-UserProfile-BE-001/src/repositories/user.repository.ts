import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from './common/abstract.repository';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { User} from '../schemas/user.schema';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
    protected readonly logger = new Logger(UserRepository.name);

    constructor(
        @InjectModel(User.name) UserModel: Model<User>,
        @InjectConnection() connection: Connection,
    ) {
        super(UserModel, connection);
    }
}
