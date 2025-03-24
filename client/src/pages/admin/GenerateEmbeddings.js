import useAxiosCustom from "../../hooks/useAxiosCustom";
import Layout from "../Layout";
import { useState } from "react";
import { generateEmbeddings } from "../../services/EmbeddingsService";
import styles from "../../styles/GenerateEmbeddings.module.css";

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
      <div className={styles.container}>
        <h1 className={styles.title}>Generate Student Embeddings</h1>
        <button className={styles.button} onClick={generate} disabled={loading}>
          {loading ? "Generating..." : "Refresh Student Data"}
        </button>
        {successMsg && <p className={styles.successMessage}>{successMsg}</p>}
        {errorMsg && <p className={styles.errorMessage}>{errorMsg}</p>}
      </div>
    </Layout>
  );
};

export default GenerateEmbeddings;
