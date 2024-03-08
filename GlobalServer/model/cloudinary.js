import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KRY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KRY,
});

const uploadFileToCloudinary = async (filePath) => {
  try {
  const result = await cloudinary.uploader.upload(filePath)

    console.log(result);
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = uploadFileToCloudinary;