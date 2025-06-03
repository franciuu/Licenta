import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

cloudinary.api.upload_presets(function(error, result) {
  if (error) {
    console.error("Error checking upload presets:", error);
    return;
  }

  const presetExists = result.presets.some(preset => preset.name === 'only_jpeg_5mb');
  
  if (!presetExists) {
    cloudinary.api.create_upload_preset({
      name: 'only_jpeg_5mb',
      folder: "students",
      allowed_formats: ['jpg', 'jpeg'],
      max_file_size: 5242880, 
      unsigned: false
    }, function(error, result) {
      if (error) {
        console.error("Error creating upload preset:", error);
      } else {
        console.log("Upload preset created successfully:", result);
      }
    });
  } else {
    console.log("Upload preset already exists");
  }
});

export default cloudinary;
