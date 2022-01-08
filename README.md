# ComfySell Backend

## Installation

```bash
$ yarn install
```

## Running the app

### Setup
- Create a file with name `.env` in project root and add configuration values (refer `.env.sample` file)

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Local Development
### Database setup
```bash
# start database
./scripts/start-database.sh

# stop database
./scripts/stop-database.sh
```

### Setup
Add the provided `catalog_sample.csv` into `scripts` directory and run
```bash
# seed data
yarn loadData
```