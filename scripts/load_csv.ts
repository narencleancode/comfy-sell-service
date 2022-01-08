import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import { config } from 'dotenv';
import { CatalogSchema, Catalog } from '../src/schema/catalog.schema';
import * as mongoose from 'mongoose';

const CSV_FILE_NAME = 'catalog_sample.csv';

config()

console.log('Connecting to Database');
mongoose.connect(process.env.MONGO_URL, { authSource: 'admin' });
const CatalogModel = mongoose.model<Catalog>('Catalog', CatalogSchema);

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
  const csvData = await getCsvData();
  console.info('Transforming data');
  const catalogData = csvData.map(mapToCatalog);
  
  console.info('Saving to database');
  await Promise.all(catalogData.map(async row => {
    await addToDatabase(row)
  }));
}

function mapToCatalog(data) {
  const catalog = new Catalog();

  catalog.name = data.sku;
  catalog.barcode = data.barcode;
  catalog.maxRetailPrice = Number(data.mrp.trim());
  catalog.weight = getLeadingNumber(data.weight);
  catalog.unit = data.unit;
  catalog.category = data.parentCategory;
  catalog.subCategory = data.subCategory;
  catalog.image = {
    full: data.image256,
    thumb: data.image128
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
    console.log(err)
    return;
  }
}

seedData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));