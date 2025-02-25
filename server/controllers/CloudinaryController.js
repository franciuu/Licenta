import cloudinary from "../config/cloudinary.js";

export const generateSignedUrl = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Generăm semnătura
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: "students",
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      timestamp,
      signature,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      folder: "students",
    });
  } catch (error) {
    res.status(500).json({ msg: "Failed to generate signature", error });
  }
};
