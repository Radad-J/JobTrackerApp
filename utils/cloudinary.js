const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { Readable } = require("stream");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (resourceType, folderPath, buffer) => {
    return new Promise((resolve, reject) => {
      const streamTransformer = cloudinary.uploader.upload_stream(
        { resource_type: resourceType, folder: folderPath },
        (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        }
      );
      let str = Readable.from(buffer);
      str.pipe(streamTransformer);
    });
  };

/*const uploadCv = async (buffer) => {
  return await uploadToCloudinary(
    "application/pdf",
    "jobApplyTracker/cv",
    buffer
  );
};

const uploadProfilePicture = async (buffer) => {
  return await uploadToCloudinary(
    "image/png",
    "jobApplyTracker/profilePicture",
    buffer
  );
};*/

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: "cv", maxCount: 1 },
  { name: "profilePicture", maxCount: 1 },
]);

module.exports = {
  uploadToCloudinary,
  uploadFields,
};
