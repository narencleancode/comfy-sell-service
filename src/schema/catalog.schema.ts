import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductCatalogDocument = ProductCatalog & Document;

@Schema()
export class Image {
  @Prop()
  url: string;

  @Prop()
  thumbnailUrl?: string;
}

const COLLECTION_NAME = 'productcatalog';

@Schema({ collection: COLLECTION_NAME })
export class ProductCatalog {
  @Prop()
  productCode: string;

  @Prop()
  title: string;

  @Prop()
  category: string;

  @Prop()
  subCategory: string;

  @Prop()
  unit?: string;

  @Prop()
  weight?: number;

  @Prop()
  maximumRetailPrice: number;

  @Prop()
  image: Image;
}

export const ProductCatalogSchema =
  SchemaFactory.createForClass(ProductCatalog);
