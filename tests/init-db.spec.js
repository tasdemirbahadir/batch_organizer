import mongoUnit from "mongo-unit";

mongoUnit.start({}).then(() => {
  console.log("fake mongo is started: ", mongoUnit.getUrl());
  process.env.DATABASE_URL = mongoUnit.getUrl();
  run();
});

after(() => {
  console.log("stopping fake mongo");
  return mongoUnit.stop();
});
