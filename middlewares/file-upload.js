const express = require('express');
const multer = require('multer');


const MIME_TYPE = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
}



const ImageUpload = multer({

    limits: 500000,
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/images')
      },
      filename: function (req, file, cb) {
        const ext = MIME_TYPE[file.mimetype];
        cb(null, Date.now() + "." + ext)
      }
    }),
    filter: (req, file, cb) => {
        const isValid = !!MIME_TYPE[file.mimetype];
        const error = isValid ? null : new Error("Invalid file format...")
        cb(error, isValid);
    }
})


module.exports = ImageUpload;
