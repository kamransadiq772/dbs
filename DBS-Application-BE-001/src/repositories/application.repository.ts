import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from './common/abstract.repository';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Application } from '../schemas/application.schema';

@Injectable()
export class ApplicationRepository extends AbstractRepository<Application> {
  protected readonly logger = new Logger(Application.name);
  constructor(
    @InjectModel(Application.name) applicationModel: Model<Application>,
    @InjectConnection() connection: Connection,
  ) {
    super(applicationModel, connection);
  }
}
// export class CommitRepository extends AbstractRepository<Commit> {

//   protected readonly logger = new Logger(Commit.name);
//   constructor(
//     @InjectModel('commit') CommitModel: Model<Commit>,
//     @InjectConnection() connection: Connection,
//   ) {
//     super(CommitModel, connection);
//   }
// }
