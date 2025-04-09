const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3Client } = require("./bucket-credentials");

exports.upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_S3_BUCKET,
        acl: 'public-read', // or 'private' if you want it restricted
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename);
        }
    })
})