import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import { config } from 'dotenv';
import {
  ProductCatalogSchema,
  ProductCatalog,
} from '../src/schema/catalog.schema';
import * as mongoose from 'mongoose';

const CSV_FILE_NAME = '../data-set/sample-product-catalog.csv';

config();

console.log('Connecting to Database...');

let mongooseConnection: mongoose.Mongoose;

const MODEL_NAME = 'ProductCatalogs';
const COLLECTION_NAME = 'productcatalog';

const CatalogModel = mongoose.model<ProductCatalog>(
  MODEL_NAME,
  ProductCatalogSchema,
  COLLECTION_NAME,
);

function getCsvData(): Promise<any[]> {
  console.log('Parsing CSV');
  return new Promise((resolve, reject) => {
    const results = [];
    createReadStream(`${__dirname}/${CSV_FILE_NAME}`)
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

  const csvData = await getCsvData();
  console.info('Transforming data');
  const catalogData = csvData.map(mapToCatalog);

  console.info(`Drop existing collection ${COLLECTION_NAME}`);
  await dropCollection(COLLECTION_NAME);

  console.info('Saving to database');
  await Promise.all(
    catalogData.map(async (row) => {
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
