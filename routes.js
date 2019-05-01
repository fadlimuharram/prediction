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

const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
const path = require("path");
var formidable = require("formidable");
var multiparty = require("multiparty");
const credentials = new SharedKeyCredential(
  STORAGE_ACCOUNT_NAME,
  ACCOUNT_ACCESS_KEY
);
const pipeline = StorageURL.newPipeline(credentials);

const serviceURL = new ServiceURL(
  `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  pipeline
);

const containerName = "samplee";

const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);

const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;
const aborter = Aborter.timeout(30 * ONE_MINUTE);
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const getHome = (req, res) => {
  res.render("index.ejs", {
    title: "home"
  });
};

const uploadImage = (req, res) => {
  // var form = new multiparty.Form();
  // form.on('part', function(part) {
  //     if (part.filename) {

  //         var size = part.byteCount - part.byteOffset;
  //         var name = part.filename;
  //         const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, name);
  //         uploadFileToBlockBlob(aborter, part., blockBlobURL)
  //             .then(res => {
  //               console.log("berhasil->", res);
  //             })
  //             .catch(e => {
  //               console.log("gagal->", e);
  //             });

  //     } else {
  //         form.handlePart(part);
  //     }
  // });
  // form.parse(req);
  // res.send('OK');

  var formidable = require("formidable");
  var form = new formidable.IncomingForm();

  // manangani upload file
  form.parse(req, function(err, fields, files) {
    console.log(files.imageUpload.path);
    var filePath = path.resolve(files.imageUpload.path);

    const blockBlobURL = BlockBlobURL.fromContainerURL(
      containerURL,
      files.imageUpload.name
    );

    console.log(blockBlobURL);

    uploadFileToBlockBlob(aborter, filePath, blockBlobURL)
      .then(data => {
        console.log("berhasil->", data);
        console.log("qq", blockBlobURL.url);
        return res.send({
          data: blockBlobURL.url
        });
      })
      .catch(e => {
        console.log("gagal->", e);
      });
  });
};

module.exports = {
  getHome,
  uploadImage
};
