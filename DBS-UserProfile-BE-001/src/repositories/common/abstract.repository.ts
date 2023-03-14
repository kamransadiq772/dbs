import {
  BadRequestException,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
  SaveOptions,
  Connection,
  InsertManyOptions,
  ProjectionType,
} from 'mongoose';

export abstract class AbstractRepository<TDocument extends any> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) { }

  async create(document: TDocument, options?: SaveOptions): Promise<TDocument> {
    try {
      const createdDocument = new this.model(document);
      return (
        await createdDocument.save(options)
      ).toJSON() as unknown as TDocument;
    } catch (err) {
      console.log(err);
      if (err.message.includes('duplicate')) {
        throw new ConflictException(`${this.model.modelName} already exists`);
      }
      throw new BadRequestException(
        `Invalid ${this.model.modelName.toLowerCase()} data entered`,
      );
    }
  }

  async batchCreate(
    documents: Omit<TDocument, '_id'>[],
    options?: InsertManyOptions,
  ): Promise<TDocument[]> {
    try {
      const insertedDocuments = await this.model.insertMany(documents, options);
      return insertedDocuments as unknown as TDocument[];
    } catch (err) {
      throw new BadRequestException(
        `Invalid ${this.model.modelName.toLowerCase()}s data entered`,
      );
    }
  }

  async delete(filterQuery?: FilterQuery<TDocument>): Promise<TDocument[]> {
    try {
      const deletedDocument = await this.model.deleteOne(filterQuery || {});
      if (deletedDocument.deletedCount === 0) {
        throw new NotFoundException(`${this.model.modelName} not found.`);
      }
      return deletedDocument as any;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException(
        `Invalid ${this.model.modelName.toLowerCase()} data entered`,
      );
    }
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) {
      this.logger.warn(
        `${this.model.modelName} not found with filterQuery`,
        filterQuery,
      );
      throw new NotFoundException(`${this.model.modelName} not found.`);
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn(
        `${this.model.modelName} not found with filterQuery:`,
        filterQuery,
      );
      throw new NotFoundException(`${this.model.modelName} not found.`);
    }

    return document;
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
  ) {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  }

  async find(
    filterQuery?: FilterQuery<TDocument>,
    projection?: ProjectionType<TDocument>,
  ) {
    return this.model.find(filterQuery || {}, projection || {}, { lean: true });
  }

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }

  async aggregate(query) {
    return await this.model.aggregate(query);
  }
}
