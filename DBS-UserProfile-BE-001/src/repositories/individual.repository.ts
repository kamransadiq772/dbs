import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from './common/abstract.repository';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Individual } from '../schemas/individual.schema';

@Injectable()
export class IndividualRepository extends AbstractRepository<Individual> {
    protected readonly logger = new Logger(IndividualRepository.name);

    constructor(
        @InjectModel(Individual.name) IndividualModel: Model<Individual>,
        @InjectConnection() connection: Connection,
    ) {
        super(IndividualModel, connection);
    }
}
