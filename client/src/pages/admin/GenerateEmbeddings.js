import { useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";

import useAxiosCustom from "../../hooks/useAxiosCustom";
import Layout from "../Layout";
import { generateEmbeddings } from "../../services/EmbeddingsService";

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
      setSuccessMsg("Embeddings generated successfully!");
    } catch (err) {
      setErrorMsg("Error generating embeddings!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-[800px] mx-auto my-10 p-4 md:p-6 bg-white/50 backdrop-blur-xl rounded-lg shadow-sm border-2 border-white/60">
        <h1 className="text-lg text-gray-800 font-semibold mb-6 pb-2 border-b-2 border-purple-500/40">
          Generate Student Embeddings
        </h1>

        <div className="text-center">
          <div className="mb-6">
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Click the button below to refresh and update the student data
              embeddings. This process may take a few moments to complete.
            </p>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-md text-sm font-medium cursor-pointer transition-all shadow-sm shadow-purple-500/10 hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-500/20 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 mb-6"
          >
            {loading ? (
              <>
                <FiRefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FiRefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                Refresh Student Data
              </>
            )}
          </button>

          {successMsg && (
            <div className="bg-green-50/80 text-green-700 p-3 rounded-md mb-4 border-l-4 border-green-500">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {successMsg}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50/80 text-red-700 p-3 rounded-md mb-4 border-l-4 border-red-500">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {errorMsg}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GenerateEmbeddings;
