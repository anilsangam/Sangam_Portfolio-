const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// Ensure public/images directory exists
const uploadDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${Date.now()}_${cleanName}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const allowed = /^(jpeg|jpg|png|webp|svg|gif|mp4|webm)$/;
  if (file.fieldname === 'resume' ? ext === 'pdf' : allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error(file.fieldname === 'resume' ? 'Resume must be a PDF file.' : 'Only image and video files are permitted!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter
});

async function uploadToCloudinaryIfAvailable(filePath) {
  if (!isCloudinaryConfigured) {
    return null;
  }
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'portfolio',
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary upload error:', (err && err.error && err.error.message) || (err && err.message) || err);
    return null;
  }
}

module.exports = {
  upload,
  uploadToCloudinaryIfAvailable
};

