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

  @Prop({ index: true })
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

  @Prop()
  listingScore?: number;
}

const ProductCatalogSchema = SchemaFactory.createForClass(ProductCatalog);

ProductCatalogSchema.index(
  {
    productCode: 'text',
    title: 'text',
    category: 'text',
    subCategory: 'text',
  },
  {
    weights: {
      productCode: 15,
      title: 10,
      subCategory: 5,
      category: 3,
    },
  },
);

export { ProductCatalogSchema };
