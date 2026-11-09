const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// Use memoryStorage so files are NEVER written to local disk
const storage = multer.memoryStorage();

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

/**
 * Uploads a file (buffer or file object) directly to Cloudinary.
 * Never stores files on local disk when Cloudinary is configured.
 * @param {Object|string} file - Multer file object with .buffer or .path, or direct buffer
 * @param {string} [folder='portfolio'] - Cloudinary target folder
 * @returns {Promise<string|null>} Cloudinary secure URL
 */
async function uploadToCloudinaryIfAvailable(file, folder = 'portfolio') {
  if (!file) return null;

  // If already a URL string, return directly
  if (typeof file === 'string' && (file.startsWith('http://') || file.startsWith('https://'))) {
    return file;
  }

  if (!isCloudinaryConfigured) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cloudinary must be configured in production to store uploaded files.');
    }

    console.warn('[Cloudinary] Keys missing. Falling back to local storage.');
    // Fallback: save to disk only if Cloudinary is not configured
    const uploadDir = path.join(__dirname, '../public/images');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const ext = (file.originalname ? path.extname(file.originalname).toLowerCase() : '.png');
    const cleanName = file.originalname ? path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_') : 'upload';
    const filename = `${Date.now()}_${cleanName}${ext}`;
    const dest = path.join(uploadDir, filename);
    if (file.buffer) {
      fs.writeFileSync(dest, file.buffer);
    }
    return '/images/' + filename;
  }

  // Upload buffer stream directly to Cloudinary (zero local disk storage)
  try {
    if (file.buffer) {
      return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'auto' },
          (err, result) => {
            if (err) return reject(err);
            resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
    }

    // If file has a disk path (e.g. from a legacy call or seed)
    if (file.path || (typeof file === 'string' && fs.existsSync(file))) {
      const p = file.path || file;
      const result = await cloudinary.uploader.upload(p, {
        folder,
        resource_type: 'auto'
      });
      // Delete temporary file from disk if it was created
      try {
        if (p.includes('public/images') || p.includes('public\\images')) {
          fs.unlinkSync(p);
        }
      } catch (e) {}
      return result.secure_url;
    }

    return null;
  } catch (err) {
    console.error('[Cloudinary Upload Error]:', (err && err.error && err.error.message) || (err && err.message) || err);
    throw new Error('Cloudinary upload failed. Please try again.');
  }
}

module.exports = {
  upload,
  uploadToCloudinaryIfAvailable
};
