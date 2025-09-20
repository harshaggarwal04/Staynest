const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Storage for profile images
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "house-rental/profile", // separate folder for profile pics
    resource_type: "image",
  },
});
const uploadProfile = multer({ storage: profileStorage });

// Storage for listing images
const listingStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "house-rental/listings",
    resource_type: "image",
  },
});
const uploadListing = multer({ storage: listingStorage });

module.exports = { cloudinary, uploadProfile, uploadListing };
