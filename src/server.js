import app from "./app";
import database from "./database";

database.init();
const server = app.init();

module.exports = server;
