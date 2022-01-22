import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { ProductCatalog, ProductCatalogDocument, } from 'src/schema/catalog.schema';

const DEFAULT_PAGINATION_COUNT = 25;

@Injectable()
export class ProductCatalogService {
    constructor(
        @InjectModel(ProductCatalog.name)
        private productCatalogModel: Model<ProductCatalogDocument>,
    ) { }

    async updateListedScoreAndGet(id: string): Promise<ProductCatalog> {
        return await this.productCatalogModel
            .findOneAndUpdate(
                {
                    productCode: { $eq: id },
                },
                {
                    $inc: { listingScore: 1 },
                },
            )
            .exec();
    }

    private getQuery(searchTerm?: string, filterBy?: string) {
        if (!!searchTerm && !!searchTerm.trim()) {
            return this.getQueryForSearch(searchTerm);
        } else if (filterBy == 'Curated List') {
            return this.getQueryForCuratedProducts();
        }
    }

    async getProductCatalog(searchTerm?: string, searchArray?: string[], filterBy?: string, page?: number): Promise<ProductCatalog[]> {
        if (searchArray && searchArray.length > 0) {
            return await searchArray.reduce(async (catalog: Promise<ProductCatalog[]>, currentSearchText: string) => {
                const currentCatalog = await this.getQueryForSearch(currentSearchText).limit(4).exec();
                const accumulatedCatalog = await catalog;
                const hashedCatalog = this.transformToHash(accumulatedCatalog);
                let catalogUpdate = [];
                if (currentCatalog && currentCatalog.length > 0) {
                    currentCatalog.forEach((product: ProductCatalog) => {
                        if (!hashedCatalog[product.productCode]) {
                            catalogUpdate.push(product);
                        }
                    });
                }
                return await [...catalogUpdate, ...accumulatedCatalog];
            }, Promise.resolve([]));
        }
        return this.withPagination(this.getQuery(searchTerm, filterBy), page).exec();
    }

    transformToHash(catalog: ProductCatalog[]) {
        return catalog.reduce((map, obj: ProductCatalog) => {
            map[obj.productCode] = obj;
            return map;
        }, {});
    }

    async updateProductListedScore(id: string) {
        await this.productCatalogModel.findOneAndUpdate({
            'productCode': { $eq: id }
        }, {
            $inc: { 'listingScore': 1 }
        }).exec();
    }

    private getQueryForCuratedProducts() {
        return this.productCatalogModel
            .find({})
            .collation({
                locale: 'en',
            })
            .sort({
                listingScore: -1,
            });
    }

    private getQueryForSearch(searchTerm: string) {
        return this.productCatalogModel.find({
            $text: {
                $search: searchTerm,
            },
        });
    }

    private withPagination(query: Query<any, any, any, any>, page: number) {
        if (!!query) {
            return query
                .skip(this.getPagesToSkip(page))
                .limit(this.getNumberOfElementsPerPage());
        }
        return query;
    }

    private getPagesToSkip(page: number) {
        const pageNumber = Math.max(page, 1);
        return this.getNumberOfElementsPerPage() * (pageNumber - 1);
    }

    private getNumberOfElementsPerPage() {
        return Number(process.env.RESULTS_PER_PAGE || DEFAULT_PAGINATION_COUNT);
    }
}
