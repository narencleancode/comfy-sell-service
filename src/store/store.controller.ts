import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {StoreService} from "./store.service";
import {Store, StoreCatalog} from "../schema/store.schema";

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get(':id')
  async getStore(@Param('id') id: string): Promise<Store> {
    return await this.storeService.getStore(id);
  }

  @Post(':id/store-catalog')
  async addStoreCatalog(@Param('id') id: string, @Body() storeCatalog: StoreCatalog) {
    return await this.storeService.addStoreCatalog(id, storeCatalog);
  }
}
