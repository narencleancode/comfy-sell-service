import { Test, TestingModule } from '@nestjs/testing';
import { ProductCatalogController } from './product-catalog.controller';

describe('ProductCatalogController', () => {
  let controller: ProductCatalogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCatalogController],
    }).compile();

    controller = module.get<ProductCatalogController>(ProductCatalogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
