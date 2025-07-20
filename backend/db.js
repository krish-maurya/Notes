const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.MONGO_URI ;
mongoose.connect(mongoURL);

const db = mongoose.connection;
db.on("connected", () => {
  console.log("Database is connected");
});

db.on("disconnected", () => {
  console.log("Database is disconnected");
});

db.on("error", (err) => {
  console.log("Error in database connection", err);
});

// Export the db connection
module.exports = db;
