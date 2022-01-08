import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CatalogDocument = Catalog & Document;

@Schema()
export class ImageData {
    @Prop()
    full: string;

    @Prop()
    thumb: string;
}

@Schema()
export class Catalog {
    @Prop()
    barcode: string;

    @Prop()
    name: string;

    @Prop()
    maxRetailPrice: number;

    @Prop()
    weight?: number;

    @Prop()
    unit?: string;

    @Prop()
    category: string;

    @Prop()
    subCategory: string;

    @Prop()
    image: ImageData;

}

export const CatalogSchema = SchemaFactory.createForClass(Catalog);
