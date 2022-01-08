import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductCatalogController } from './product-catalog/product-catalog.controller';
import { ProductCatalogService } from './product-catalog/product-catalog.service';
import { ProductCatalog, ProductCatalogSchema } from './schema/catalog.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME,
    }),
    MongooseModule.forFeature([
      { name: ProductCatalog.name, schema: ProductCatalogSchema },
    ]),
  ],
  controllers: [AppController, ProductCatalogController],
  providers: [AppService, ProductCatalogService],
})
export class AppModule {}
