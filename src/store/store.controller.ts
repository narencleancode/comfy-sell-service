import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store, StoreCatalog } from '../schema/store.schema';
import { ProductItemDto } from '../dto/product-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get(':id/store-catalog')
  async getStore(@Param('id') id: string): Promise<ProductItemDto[]> {
    return await this.storeService.getStoreCatalogItems(id);
  }

  @Post(':id/store-catalog')
  async addStoreCatalog(
    @Param('id') id: string,
    @Body() storeCatalog: StoreCatalog,
  ) {
    return await this.storeService.addStoreCatalog(id, storeCatalog);
  }

  @Post(':id/store-catalog/:productCode')
  async addStoreCatalogByProductCode(
    @Param('id') id: string,
    @Param('productCode') productCode: string,
  ) {
    return await this.storeService.addStoreCatalogByProductId(id, productCode);
  }

  @UseInterceptors(FileInterceptor('file', {dest: './upload'}))
  @Post('bulk-upload')
  async addMultipleProductsByFileUpload(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      successfulUploads: await this.storeService.addMultipleProductsByFileUpload(file)
    };
  }
}
