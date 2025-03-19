import useAxiosCustom from "../hooks/useAxiosCustom";
import Layout from "./Layout";
import { useState } from "react";
import { generateEmbeddings } from "../services/EmbeddingsService";

const GenerateEmbeddings = () => {
  const axiosCustom = useAxiosCustom();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const generate = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await generateEmbeddings(axiosCustom);
      setSuccessMsg("Embeddinguri generate cu succes!");
    } catch (err) {
      setErrorMsg("Eroare la generare embeddings!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1>Generate Student Embeddings</h1>
      <button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Refresh Student Data"}
      </button>
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </Layout>
  );
};

export default GenerateEmbeddings;
