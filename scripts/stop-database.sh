#!/bin/sh

source $(dirname $0)/common.sh

echo "Stopping MongoDB"
docker stop $MONGO_CONTAINER_NAME
echo "Done"