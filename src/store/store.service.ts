import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreCatalog, StoreDocument } from '../schema/store.schema';
import { ProductCatalogService } from '../product-catalog/product-catalog.service';
import {ProductItemDto} from "../dto/product-item.dto";

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    private productCatalogService: ProductCatalogService,
  ) {}

    async getStoreCatalogItems(id: string): Promise<ProductItemDto[]> {
        return this.storeModel.findOne({code: {$eq: id}}).exec()
            .then(value => value.storeCatalogs
                .map((storeCatalog, index) => new ProductItemDto(storeCatalog))
            );
    }

  async addStoreCatalog(id: string, storeCatalog: StoreCatalog) {
    const store = await this.storeModel.findOne({ code: { $eq: id } }).exec();
    if (
      store.storeCatalogs.find(
        (value) => value.productCode == storeCatalog.productCode,
      )
    ) {
        await this.productCatalogService.updateListedScoreAndGet(
            storeCatalog.productCode,
        );
      return this.storeModel
        .findOneAndUpdate(
          {
            code: { $eq: id },
            'storeCatalogs.productCode': { $eq: storeCatalog.productCode },
          },
          {
            $set: {
              'storeCatalogs.$': storeCatalog,
            },
          },
          { new: true, upsert: true },
        )
        .exec();
    } else {
      await this.productCatalogService.updateListedScoreAndGet(
        storeCatalog.productCode,
      );
      return this.storeModel
        .findOneAndUpdate(
          {
            code: { $eq: id },
          },
          {
            $push: {
              storeCatalogs: storeCatalog,
            },
          },
          { new: true, upsert: true },
        )
        .exec();
    }
  }

  async addStoreCatalogByProductId(id: string, productCode: string) {
    const store = await this.storeModel.findOne({ code: { $eq: id } });
    const product = store.storeCatalogs.find(
      (value) => value.productCode == productCode,
    );
    if (!!product) {
      return product;
    }

    const insertedProduct =
      await this.productCatalogService.updateListedScoreAndGet(productCode);
    if (!!insertedProduct) {
      const storeCatalog = StoreCatalog.fromProduct(insertedProduct);
      this.storeModel
        .findOneAndUpdate(
          {
            code: { $eq: id },
          },
          {
            $push: {
              storeCatalogs: storeCatalog,
            },
          },
          { new: true, upsert: true },
        )
        .exec();
      return storeCatalog;
    }

    throw new NotFoundException();
  }
}
