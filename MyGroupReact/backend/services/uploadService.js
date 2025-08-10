
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Configure Wasabi S3
const wasabiS3 = new AWS.S3({
  accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
  secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY,
  endpoint: process.env.WASABI_ENDPOINT,
  region: process.env.WASABI_REGION,
  s3ForcePathStyle: true
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES.split(',');
  const fileExtension = path.extname(file.originalname).toLowerCase().slice(1);
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${fileExtension} not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Configure multer for Wasabi upload
const upload = multer({
  storage: multerS3({
    s3: wasabiS3,
    bucket: process.env.WASABI_BUCKET_NAME,
    key: function (req, file, cb) {
      const folder = req.body.folder || 'general';
      const timestamp = Date.now();
      const filename = `${folder}/${timestamp}-${file.originalname}`;
      cb(null, filename);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
        uploadedBy: req.user?.id || 'anonymous',
        uploadDate: new Date().toISOString()
      });
    }
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  }
});

// Upload middleware for different file types
const uploadMiddleware = {
  single: (fieldName) => upload.single(fieldName),
  multiple: (fieldName, maxCount = 5) => upload.array(fieldName, maxCount),
  fields: (fields) => upload.fields(fields)
};

// Delete file from Wasabi
const deleteFile = async (key) => {
  try {
    await wasabiS3.deleteObject({
      Bucket: process.env.WASABI_BUCKET_NAME,
      Key: key
    }).promise();
    return true;
  } catch (error) {
    console.error('Error deleting file from Wasabi:', error);
    return false;
  }
};

// Get signed URL for file access
const getSignedUrl = (key, expires = 3600) => {
  return wasabiS3.getSignedUrl('getObject', {
    Bucket: process.env.WASABI_BUCKET_NAME,
    Key: key,
    Expires: expires
  });
};

// List files in bucket
const listFiles = async (prefix = '') => {
  try {
    const params = {
      Bucket: process.env.WASABI_BUCKET_NAME,
      Prefix: prefix
    };
    
    const data = await wasabiS3.listObjectsV2(params).promise();
    return data.Contents;
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
};

module.exports = {
  uploadMiddleware,
  deleteFile,
  getSignedUrl,
  listFiles,
  wasabiS3
};
