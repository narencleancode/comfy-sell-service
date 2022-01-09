import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {Image, ProductCatalog} from "./catalog.schema";

export type StoreDocument = Store & Document;


const COLLECTION_NAME = 'store';

@Schema()
export class Location {
  @Prop()
  latitude: number;

  @Prop()
  longitude: number;
}

@Schema()
export class StoreCatalog {
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
  storePrice: number;

  @Prop()
  maximumRetailPrice: number;

  @Prop()
  quantity: number;

  @Prop()
  image: Image;

}

@Schema({ collection: COLLECTION_NAME })
export class Store {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  location: Location;

  @Prop()
  paymentModes: Array<string>;

  @Prop()
  fulfilmentModes: Array<string>;

  @Prop()
  storeCatalogs: Array<StoreCatalog>
}

export const StoreSchema =
  SchemaFactory.createForClass(Store);
