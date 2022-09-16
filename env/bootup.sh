docker rm -f batch_organizer_mongo;
mkdir -p /Users/bahadirtasdemir/batch_organizer_mongo/data
docker run -d --name batch_organizer_mongo \
  --memory=2g \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=mongo \
  -e MONGO_INITDB_ROOT_PASSWORD=mongo \
  -v /Users/bahadirtasdemir/batch_organizer_mongo/data:/data/db \
  mongo;
