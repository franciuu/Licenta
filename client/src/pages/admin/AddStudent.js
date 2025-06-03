import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import useAxiosCustom from "../../hooks/useAxiosCustom";
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload";
import Layout from "../Layout";
import { createStudent } from "../../services/StudentService";
import Uploader from "../../components/admin/Uploader";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  birthDate: Yup.date()
    .max(new Date(), "Birth date cannot be in the future")
    .required("Birth date is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  studyYear: Yup.number()
    .typeError("Study year must be a number")
    .integer("Study year must be an integer")
    .min(1, "Minimum study year is 1")
    .max(6, "Maximum study year is 6")
    .required("Study year is required"),
});

const AddStudent = () => {
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();
  const { uploadImage } = useCloudinaryUpload();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const uploadImages = async (files) => {
    try {
      const uploaded = await uploadImage(files);
      if (!uploaded || uploaded.length === 0) {
        throw new Error("No images were successfully uploaded");
      }
      return uploaded;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw new Error(`Failed to upload images: ${error.message}`);
    }
  };

  const addStudent = async (formData) => {
    try {
      setLoading(true);
      const imageUrls = await uploadImages(files);
      if (!imageUrls || imageUrls.length === 0) {
        throw new Error("No images were uploaded");
      }
      await createStudent(axiosCustom, formData, imageUrls);
      navigate("/admin/students");
    } catch (error) {
      setError(error.message || "Failed to create student");
      console.error("Failed to create student:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-[800px] mx-auto my-10 p-4 md:p-6 bg-white/50 backdrop-blur-xl rounded-lg shadow-sm border-2 border-white/60">
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate("/admin/students");
          }}
          className="text-sm text-purple-600 hover:text-purple-800 mb-3 transition-colors"
        >
          ← Back to Students
        </button>
        <h1 className="text-lg text-gray-800 font-semibold mb-3 pb-2 border-b-2 border-purple-500/40">
          Add Student
        </h1>

        {error && (
          <div className="bg-red-50/80 text-red-500 p-3 rounded-md mb-4 border-l-3 border-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(addStudent)} className="mb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-4">
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="font-medium text-gray-700 text-sm mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. John Doe"
                  {...register("name")}
                  className="px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="font-medium text-gray-700 text-sm mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. johndoe@gmail.com"
                  {...register("email")}
                  className="px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label
                  htmlFor="birthDate"
                  className="font-medium text-gray-700 text-sm mb-1"
                >
                  Birth Date
                </label>
                <input
                  id="birthDate"
                  type="date"
                  {...register("birthDate")}
                  className="px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="studyYear"
                  className="font-medium text-gray-700 text-sm mb-1"
                >
                  Study Year
                </label>
                <input
                  id="studyYear"
                  type="number"
                  placeholder="e.g. 1"
                  {...register("studyYear")}
                  className="px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                />
                {errors.studyYear && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.studyYear.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="upload"
              className="font-medium text-gray-700 text-sm mb-1 block"
            >
              Upload Images
            </label>
            <div className="mt-1">
              <Uploader id="upload" files={files} setFiles={setFiles} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white border-none rounded-md px-5 py-2 text-sm font-medium cursor-pointer transition-all shadow-sm shadow-purple-500/10 mt-3 block ml-auto hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-500/20 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? "Uploading..." : "Save"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddStudent;
