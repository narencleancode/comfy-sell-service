import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductCatalog,
  ProductCatalogDocument,
} from 'src/schema/catalog.schema';

@Injectable()
export class ProductCatalogService {
  constructor(
    @InjectModel(ProductCatalog.name)
    private productCatalogModel: Model<ProductCatalogDocument>,
  ) {}

  async getProductCatalog(searchTerm?: string): Promise<ProductCatalog[]> {
    if (!!searchTerm && !!searchTerm.trim()) {
      return this.searchProduct(searchTerm);
    }

    return await this.productCatalogModel.find({}, null, { limit: 50 }).exec();
  }

  async searchProduct(searchTerm: string): Promise<ProductCatalog[]> {
    return await this.productCatalogModel
      .find({
        $text: {
          $search: searchTerm,
        },
      })
      .limit(50)
      .exec();
  }
}
