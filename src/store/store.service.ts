import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Store, StoreDocument} from "../schema/store.schema";

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name)
    private storeModel: Model<StoreDocument>,
  ) {}

  async getStore(
    id:string,
  ): Promise<Store> {
    return this.storeModel.find({code:{$eq:id}}).findOne().exec();
  }
}
