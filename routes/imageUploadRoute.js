const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const express = require('express');
const checkAuth = require('../middlewares/checkAuth');
const sharp = require('sharp');

const router = express.Router();

cloudinary.config({
  cloud_name: 'dqwrhvzxt',
  api_key: '239417615358347',
  api_secret: 'v5MOL6KD22vMpM49Wy2R1v0PmzY',
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', checkAuth, upload.single('image'), async (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ message: 'Please upload a file' });
  }

  sharp(file.buffer)
    .resize({ width: 800 })
    .toBuffer(async (err, data, info) => {
      if (err) {
        res.status(400).json({ message: 'Error while processing image' });
      }

      const result = await cloudinary.uploader
        .upload_stream(
          {
            folder: 'blogImages',
            resource_type: 'auto',
          },
          async (err, result) => {
            if (err) {
              res.status(400).json({ message: 'Error while uploading image' });
            }

            res
              .status(200)
              .json({
                message: 'image successfully uploaded',
                url: result.url,
              });
          }
        )
        .end(data);
    });
});

module.exports = router;
