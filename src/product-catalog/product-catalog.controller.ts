import { Controller, Get } from '@nestjs/common';
import { ProductCatalog } from 'src/schema/catalog.schema';
import { ProductCatalogService } from './product-catalog.service';

@Controller('product-catalog')
export class ProductCatalogController {
  constructor(private readonly productCatalogService: ProductCatalogService) {}

  @Get()
  async getProductCatalog(): Promise<ProductCatalog[]> {
    return await this.productCatalogService.getProductCatalog();
  }
}
