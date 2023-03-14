import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from './common/abstract.repository';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
// import { Application } from '../schemas/application.schema';
import { ICommitApplication } from '../interfaces/application/commit-application.interface';
import { UpdateApplicationDto } from 'src/dto/application';
import { Commit } from '../schemas/commit-appliction.schema';

@Injectable()
export class CommitRepository extends AbstractRepository<Commit> {

  protected readonly logger = new Logger(Commit.name);
  constructor(
    @InjectModel('commit') CommitModel: Model<Commit>,
    @InjectConnection() connection: Connection,
  ) {
    super(CommitModel, connection);
  }
}
