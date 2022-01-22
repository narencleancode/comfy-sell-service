import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductCatalogController } from './product-catalog/product-catalog.controller';
import { ProductCatalogService } from './product-catalog/product-catalog.service';
import { ProductCatalog, ProductCatalogSchema } from './schema/catalog.schema';
import { ConfigModule } from '@nestjs/config';
import { Store, StoreSchema } from './schema/store.schema';
import { StoreController } from './store/store.controller';
import { StoreService } from './store/store.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME,
    }),
    MongooseModule.forFeature([
      { name: ProductCatalog.name, schema: ProductCatalogSchema },
      { name: Store.name, schema: StoreSchema },
    ]),
  ],
  controllers: [AppController, ProductCatalogController, StoreController],
  providers: [AppService, ProductCatalogService, StoreService],
})
export class AppModule {}
