import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from './common/abstract.repository';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { ProfilePic } from '../schemas/profile.pic.schema';

@Injectable()
export class ProfilePicRepository extends AbstractRepository<ProfilePic> {
  protected readonly logger = new Logger(ProfilePicRepository.name);

  constructor(
    @InjectModel(ProfilePic.name) profilePicModel: Model<ProfilePic>,
    @InjectConnection() connection: Connection,
  ) {
    super(profilePicModel, connection);
  }
}
