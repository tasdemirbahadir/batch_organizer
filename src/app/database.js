import config from "config";
import mongoose from "mongoose";
import debug from "debug";

const init = () => {
  const mongoUrl = process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : `mongodb://${config.databaseUserName}:${config.databasePassword}@${config.database}?authSource=admin&retryWrites=true&w=majority`;
  mongoose.connect(mongoUrl);
  let db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("DB Connected successfully");
  });
};

module.exports = { init };
