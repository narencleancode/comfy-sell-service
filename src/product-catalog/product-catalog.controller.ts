import { Controller, Get, Query } from '@nestjs/common';
import { ProductCatalog } from 'src/schema/catalog.schema';
import { ProductCatalogService } from './product-catalog.service';

@Controller('product-catalog')
export class ProductCatalogController {
  constructor(private readonly productCatalogService: ProductCatalogService) {}

  @Get()
  async getProductCatalog(
    @Query('q') searchTerm?: string,
    @Query('page') page: number = 1,
  ): Promise<ProductCatalog[]> {
    return await this.productCatalogService.getProductCatalog(searchTerm, page);
  }

  @Get('curated-list')
  async getCuratedProductCatalogs(
      @Query('count') count: number = 20,
  ): Promise<ProductCatalog[]> {
    return await this.productCatalogService.getCuratedProductCatalog(count);
  }
}
