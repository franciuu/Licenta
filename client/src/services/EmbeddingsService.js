export const generateEmbeddings = async (axiosCustom) => {
  try {
    const response = await axiosCustom.post("/embeddings");
    return response.data;
  } catch (error) {
    console.error("Eroare în EmbeddingService:", error);
    throw error;
  }
};
