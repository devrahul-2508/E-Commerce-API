const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');
 
 
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ProductImages',
    format: async (req, file) => ["jpg","png","jpeg/"], // supports promises as well
    public_id: (req, file) => 'computed-filename-using-request',
  },
});
 

var upload = multer({
    storage: storage
})

module.exports = upload;