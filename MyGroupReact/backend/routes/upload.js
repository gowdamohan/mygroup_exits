
const express = require('express');
const router = express.Router();
const { uploadMiddleware, deleteFile, getSignedUrl, listFiles } = require('../services/uploadService');
const auth = require('../middleware/auth');

// Upload single file
router.post('/single', auth, (req, res) => {
  uploadMiddleware.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        key: req.file.key,
        location: req.file.location,
        bucket: req.file.bucket,
        size: req.file.size,
        contentType: req.file.contentType
      }
    });
  });
});

// Upload multiple files
router.post('/multiple', auth, (req, res) => {
  uploadMiddleware.multiple('files', 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const files = req.files.map(file => ({
      key: file.key,
      location: file.location,
      bucket: file.bucket,
      size: file.size,
      contentType: file.contentType
    }));

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      files: files
    });
  });
});

// Get signed URL for file access
router.get('/signed-url/:key(*)', auth, (req, res) => {
  try {
    const key = req.params.key;
    const expires = parseInt(req.query.expires) || 3600;
    
    const signedUrl = getSignedUrl(key, expires);
    
    res.json({
      success: true,
      signedUrl: signedUrl,
      expires: expires
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating signed URL',
      error: error.message
    });
  }
});

// Delete file
router.delete('/:key(*)', auth, async (req, res) => {
  try {
    const key = req.params.key;
    const deleted = await deleteFile(key);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete file'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
});

// List files
router.get('/list', auth, async (req, res) => {
  try {
    const prefix = req.query.prefix || '';
    const files = await listFiles(prefix);
    
    res.json({
      success: true,
      files: files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error listing files',
      error: error.message
    });
  }
});

module.exports = router;
