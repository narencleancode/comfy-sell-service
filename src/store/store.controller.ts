import {Controller, Get, Param, Query} from '@nestjs/common';
import {StoreService} from "./store.service";
import {Store} from "../schema/store.schema";

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get(':id')
  async getStore(@Param('id') id: string): Promise<Store> {
    return await this.storeService.getStore(id);
  }
}
