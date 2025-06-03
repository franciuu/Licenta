import useAxiosCustom from "./useAxiosCustom";

const useCloudinaryUpload = () => {
  const axiosCustom = useAxiosCustom();

  const uploadImage = async (files) => {
    try {
      // First get the signature
      const signatureResponse = await axiosCustom.get("/cloudinary-signature");
      const { timestamp, signature, api_key, folder, upload_preset } = signatureResponse.data;

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file.file);
      });
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("api_key", api_key);
      formData.append("folder", folder);
      formData.append("upload_preset", upload_preset);

      const response = await axiosCustom.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data.urls || response.data.urls.length === 0) {
        throw new Error("No URLs returned from upload");
      }

      return response.data.urls;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error(error.response?.data?.msg || "Upload failed");
    }
  };

  return { uploadImage };
};

export default useCloudinaryUpload;
