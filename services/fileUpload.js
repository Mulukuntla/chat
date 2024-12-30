const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("./S3services");

// Configure multer to use S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME, // Your S3 bucket name
    acl: "public-read", // File will be publicly accessible
    key: (req, file, cb) => {
      const uniqueName = Date.now().toString() + "-" + file.originalname;
      cb(null, uniqueName); // File name in the bucket
    },
  }),
});

module.exports = upload;