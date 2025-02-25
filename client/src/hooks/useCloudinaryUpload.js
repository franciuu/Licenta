import { useState } from "react";
import axios from "axios";
import { axiosCustom } from "../api/axios";

const useCloudinaryUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    try {
      setLoading(true);

      // Obține token-ul semnat de la backend
      const tokenResponse = await axiosCustom.get("/generate-upload-token");
      const { timestamp, signature, cloudName, apiKey, folder } =
        tokenResponse.data;

      // Pregătește formData pentru Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      // Trimite fișierul direct la Cloudinary
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      setLoading(false);
      return uploadResponse.data.secure_url; // Returnează URL-ul imaginii
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      setError("Upload failed.");
      setLoading(false);
      return null;
    }
  };

  return { uploadImage, loading, error };
};

export default useCloudinaryUpload;
