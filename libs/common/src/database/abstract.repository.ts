import { Logger, NotFoundException } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";

export abstract class AbstractRepository<T extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<T>) { }

  async create(createDto: Omit<T, '_id'>): Promise<T> {
    const createdDocument = new this.model({ ...createDto, _id: new Types.ObjectId() });
    return (await createdDocument.save()).toJSON() as unknown as T;
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T> {
    const document = await this.model.findOne(filterQuery).lean<T>(true);

    if (!document) {
      this.logger.warn(`Document not found with filter: ${JSON.stringify(filterQuery)}`);
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async findOneAndUpdate(filterQuery: FilterQuery<T>, update: UpdateQuery<T>): Promise<T> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, { new: true })
      .lean<T>(true);

    if (!document) {
      this.logger.warn(`Document not found with filter: ${JSON.stringify(filterQuery)}`);
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async find(filterQuery?: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filterQuery).lean<T[]>(true);
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T> {
    const document = await this.model.findOneAndDelete(filterQuery).lean<T>(true);

    if (!document) {
      this.logger.warn(`Document not found with filter: ${JSON.stringify(filterQuery)}`);
      throw new NotFoundException('Document not found');
    }

    return document;
  }
}
