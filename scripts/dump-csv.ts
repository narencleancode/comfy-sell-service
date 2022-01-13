import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import { config } from 'dotenv';
import {
  ProductCatalogSchema,
  ProductCatalog,
} from '../src/schema/catalog.schema';
import * as mongoose from 'mongoose';
import { Store, StoreSchema } from '../src/schema/store.schema';

const PRODUCT_CATALOG_CSV_FILE_NAME = '../data-set/sample-product-catalog.csv';
const STORE_CSV_FILE_NAME = '../data-set/sample-store.csv';

config();

console.log('Connecting to Database...');

let mongooseConnection: mongoose.Mongoose;

const PRODUCT_CATALOG_MODEL_NAME = 'ProductCatalogs';
const PRODUCT_CATALOG_COLLECTION_NAME = 'productcatalog';

const STORE_MODEL_NAME = 'Store';
const STORE_COLLECTION_NAME = 'store';

const CatalogModel = mongoose.model<ProductCatalog>(
  PRODUCT_CATALOG_MODEL_NAME,
  ProductCatalogSchema,
  PRODUCT_CATALOG_COLLECTION_NAME,
);

const StoreModel = mongoose.model<Store>(
  STORE_MODEL_NAME,
  StoreSchema,
  STORE_COLLECTION_NAME,
);

function getCsvData(fileName): Promise<any[]> {
  console.log('Parsing CSV');
  return new Promise((resolve, reject) => {
    const results = [];
    createReadStream(`${__dirname}/${fileName}`)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      });
  });
}

async function seedData() {
  mongooseConnection = await mongoose.connect(process.env.MONGO_URL, {
    authSource: 'admin',
    dbName: process.env.DB_NAME,
  });

  //Product Catalog
  const productCatalogCsvData = await getCsvData(PRODUCT_CATALOG_CSV_FILE_NAME);
  console.info('Transforming Product Catalog data');
  const catalogData = productCatalogCsvData.map(mapToCatalog);

  console.info(
    `Drop existing product catalog collection ${PRODUCT_CATALOG_COLLECTION_NAME}`,
  );
  await dropCollection(PRODUCT_CATALOG_COLLECTION_NAME);

  console.info('Saving product catalog to database');
  await Promise.all(
    catalogData.map(async (row) => {
      await addToDatabase(row);
    }),
  );

  //Store
  const storeCsvData = await getCsvData(STORE_CSV_FILE_NAME);
  console.info('Transforming Store data');
  const storeData = storeCsvData.map(mapToStore);

  console.info(`Drop existing store collection ${STORE_COLLECTION_NAME}`);
  await dropCollection(STORE_COLLECTION_NAME);

  console.info('Saving store collection to database');
  await Promise.all(
    storeData.map(async (row) => {
      await addToDatabase(row);
    }),
  );
}

function mapToCatalog(data) {
  const catalog = new ProductCatalog();

  catalog.productCode = data.barcode;
  catalog.title = data.sku;
  catalog.category = data.parentCategory;
  catalog.subCategory = data.subCategory;
  catalog.unit = data.unit;
  catalog.weight = getLeadingNumber(data.weight);
  catalog.maximumRetailPrice = Number(data.mrp.trim());
  catalog.image = {
    url: data.image256,
    thumbnailUrl: data.image128,
  };

  return new CatalogModel(catalog);
}

function mapToStore(data) {
  const store = new Store();

  store.code = data.code;
  store.name = data.name;
  store.type = data.type;
  store.location = {
    latitude: data.lat,
    longitude: data.lon,
  };
  store.fulfilmentModes = [data.fulfilmentMode];
  store.paymentModes = [data.paymentMode];
  store.storeCatalogs = [];

  return new StoreModel(store);
}

function getLeadingNumber(text: string): number {
  return Number(text.match(/^\s*(\d+).*$/)[1]);
}

async function addToDatabase(document: mongoose.Document) {
  try {
    await document.save();
  } catch (err) {
    console.log('failed to save document ', document);
    console.log(err);
    return;
  }
}

async function dropCollection(collectionName: string) {
  const collections = await mongooseConnection.connection.db.collections();
  const collectionExists = collections.find(
    (collection) => collection.collectionName === collectionName,
  );
  if (collectionExists) {
    await mongooseConnection.connection.db.dropCollection(collectionName);
  }
}

seedData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
