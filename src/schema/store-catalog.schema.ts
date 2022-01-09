import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StoreCatalogDocument = StoreCatalog & Document;

const COLLECTION_NAME = 'store_catalog';

@Schema({ collection: COLLECTION_NAME })
export class StoreCatalog {
  @Prop()
  storeCode: string;

  @Prop()
  catalogCode: string;

  @Prop()
  qty: number;
}

export const StoreCatalogSchema =
  SchemaFactory.createForClass(StoreCatalog);
