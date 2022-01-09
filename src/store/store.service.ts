import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Store, StoreCatalog, StoreDocument} from "../schema/store.schema";

@Injectable()
export class StoreService {
    constructor(
        @InjectModel(Store.name)
        private storeModel: Model<StoreDocument>,
    ) {
    }

    async getStore(
        id: string,
    ): Promise<Store> {
        return this.storeModel.findOne({code: {$eq: id}}).exec();
    }

    async addStoreCatalog(id: string, storeCatalog: StoreCatalog) {
        const store = await this.storeModel.findOne({'code':{$eq: id}}).exec();
        if(store.storeCatalogs.find(value => value.productCode == storeCatalog.productCode)) {
            return this.storeModel.findOneAndUpdate({
                'code': {$eq: id},
                'storeCatalogs.productCode': {$eq: storeCatalog.productCode}
            }, {
                "$set": {
                    "storeCatalogs.$": storeCatalog
                }
            }, {new: true, upsert: true}).exec()
        } else {
            return this.storeModel.findOneAndUpdate({
                'code': {$eq: id}
            }, {
                "$push": {
                    "storeCatalogs": storeCatalog
                }
            }, {new: true, upsert: true}).exec()
        }
    }
}
