const express = require('express');
const router = express.Router();
const upload = require('../config/multer'); 

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  console.log(`Uploaded file: ${req.file.filename}`);
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ filePath });
});

module.exports = router;
