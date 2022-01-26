import { Image } from '../schema/catalog.schema';
import { StoreCatalog } from '../schema/store.schema';

export class ProductItemDto {
  productCode: string;
  title: string;
  category: string;
  subCategory: string;
  unit?: string;
  weight?: number;
  quantity?: number;
  maximumRetailPrice: number;
  storePrice?: number;
  image: Image;

  constructor(storeCatalog: StoreCatalog) {
    this.productCode = storeCatalog.productCode;
    this.title = storeCatalog.title;
    this.category = storeCatalog.category;
    this.subCategory = storeCatalog.subCategory;
    this.unit = storeCatalog.unit;
    this.weight = storeCatalog.weight;
    this.quantity = storeCatalog.quantity;
    this.maximumRetailPrice = storeCatalog.maximumRetailPrice;
    this.storePrice = storeCatalog.storePrice;
    this.image = storeCatalog.image;
  }
}
