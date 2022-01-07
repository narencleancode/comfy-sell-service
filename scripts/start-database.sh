#!/bin/sh
source $(dirname $0)/common.sh

echo "Starting MongoDB"
docker run -d --rm --name $MONGO_CONTAINER_NAME \
-p $MONGO_HOST_PORT:$MONGO_CONTAINER_PORT \
-e MONGO_INITDB_ROOT_USERNAME=$MONGO_LOCAL_USER \
-e MONGO_INITDB_ROOT_PASSWORD=$MONGO_LOCAL_PASSWORD \
mongo
echo "Done. MongoDB started at port $MONGO_HOST_PORT"