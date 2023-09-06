// var MongoClient = require("mongodb").MongoClient;
import { MongoClient } from "mongodb";
var url = "mongodb://localhost:27017/test_upload"; // mydatabase is the name of db
MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var collection = db.collection("images");
  console.log("Database created!");
  db.close();
});
