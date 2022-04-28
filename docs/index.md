# ComfySell Backend

## Installation

```bash
$ yarn install
```

## Running the app

### Setup
- Create a file with name `.env` in project root and add configuration values (refer `.env.local` file)

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
yarn dump-product-catalog
```

#### Setup Voice (Vakyansh)
Execute the following steps to download the model to the directory `voice_models`
```bash
mkdir voice_models
cd voice_models
wget https://storage.googleapis.com/asr-public-models/data-sources-deployment/indian_english/dict.ltr.txt
wget https://storage.googleapis.com/asr-public-models/data-sources-deployment/indian_english/final_model.pt
wget https://storage.googleapis.com/asr-public-models/data-sources-deployment/indian_english/lexicon.lst
wget https://storage.googleapis.com/asr-public-models/data-sources-deployment/indian_english/lm.binary
```

Create a file `model_dict.json` with the file contents inside the directory `voice_models`:
```json
{
        "en": {
                "path": "/models/english/final_model.pt",
                "enablePunctuation": false,
                "enableITN": false
        }
}
```

Execute the following steps to start the Vakyansh speech recognition service
```bash
cd ../
docker run -m 80000m -itd -p 50051:50051 --name speech_recognition_open_api -v $(pwd)/voice_models:/opt/speech_recognition_open_api/deployed_models/ gcr.io/ekstepspeechrecognition/speech_recognition_model_api:3.0.4
```
