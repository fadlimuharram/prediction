const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  SharedKeyCredential,
  StorageURL,
  uploadStreamToBlockBlob,
  uploadFileToBlockBlob
} = require("@azure/storage-blob");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const fs = require("fs");
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

app.set("port", port);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs"); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { getHome, uploadImage } = require("./routes");

app.get("/", getHome);
app.post("/", uploadImage);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
