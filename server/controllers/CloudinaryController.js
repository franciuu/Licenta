import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(new Error("Only JPG/JPEG files are allowed"), false);
    }
  },
}).array("files", 10);

export const generateSignedUrl = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: "students",
        upload_preset: "only_jpeg_5mb",
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      timestamp,
      signature,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      folder: "students",
      upload_preset: "only_jpeg_5mb",
    });
  } catch (error) {
    console.error("Error generating signature:", error);
    res.status(500).json({ msg: "Failed to generate signature" });
  }
};

export const uploadFiles = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ msg: err.message });
      } else if (err) {
        return res.status(400).json({ msg: err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: "No files uploaded" });
      }

      const uploadedUrls = [];

      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "students",
          upload_preset: "only_jpeg_5mb",
          public_id: `student_${uuidv4()}`,
          resource_type: "image",
        });

        uploadedUrls.push(result.secure_url);
      }

      res.status(200).json({ urls: uploadedUrls });
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ msg: "Upload failed", error: error.message });
  }
};
