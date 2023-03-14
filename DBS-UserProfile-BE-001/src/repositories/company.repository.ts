import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from './common/abstract.repository';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Company } from '../schemas/company.schema';

@Injectable()
export class CompanyRepository extends AbstractRepository<Company> {
    protected readonly logger = new Logger(CompanyRepository.name);

    constructor(
        @InjectModel(Company.name) ComapanyModel: Model<Company>,
        @InjectConnection() connection: Connection,
    ) {
        super(ComapanyModel, connection);
    }
}
