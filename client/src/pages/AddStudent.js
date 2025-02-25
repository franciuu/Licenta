import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosCustom from "../hooks/useAxiosCustom";
import Layout from "./Layout";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  date: Yup.date()
    .max(new Date(), "Birth date cannot be in the future")
    .required("Birth date is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  year: Yup.number()
    .typeError("Study year must be a number")
    .integer("Study year must be an integer")
    .min(1, "Minimum study year is 1")
    .max(6, "Maximum study year is 6")
    .required("Study year is required"),
});

const AddStudent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    email: "",
    year: "",
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();

  // Funcție pentru a selecta fișierele
  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  // Funcție pentru a încărca imaginile pe Cloudinary
  const uploadImages = async () => {
    try {
      setUploading(true);
      const { data } = await axiosCustom.get("/cloudinary-signature"); // Obținem semnătura

      const uploadedImageUrls = [];

      for (const file of images) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", data.api_key);
        formData.append("timestamp", data.timestamp);
        formData.append("signature", data.signature);
        formData.append("folder", data.folder);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${data.cloud_name}/image/upload`,
          { method: "POST", body: formData }
        );

        const fileData = await response.json();
        uploadedImageUrls.push(fileData.secure_url);
      }

      setUploading(false);
      return uploadedImageUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      setUploading(false);
      throw new Error("Image upload failed.");
    }
  };

  // Funcție pentru a adăuga studentul
  const addStudent = async () => {
    try {
      let imageUrls = [];
      if (images.length > 0) {
        imageUrls = await uploadImages();
      }

      const response = await axiosCustom.post("/students", {
        ...formData,
        images: imageUrls,
      });

      if (response.data) {
        navigate("/students");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "An unexpected error occurred");
    }
  };

  return (
    <Layout>
      <h1>Add student</h1>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit(addStudent)}>
        <div className="inputDiv">
          <label>Name: </label>
          <div className="input">
            <input
              {...register("name")}
              type="text"
              placeholder="Name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <p>{errors.name?.message}</p>
        </div>

        <div className="inputDiv">
          <label>Birth Date: </label>
          <div className="input">
            <input
              {...register("date")}
              type="date"
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
          <p>{errors.date?.message}</p>
        </div>

        <div className="inputDiv">
          <label>Email: </label>
          <div className="input">
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <p>{errors.email?.message}</p>
        </div>

        <div className="inputDiv">
          <label>Study year: </label>
          <div className="input">
            <input
              {...register("year")}
              type="number"
              placeholder="Study year"
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
            />
          </div>
          <p>{errors.year?.message}</p>
        </div>

        <div className="inputDiv">
          <label>Upload images:</label>
          <div className="input">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </div>
          {images.length > 0 && (
            <div>
              <p>Selected images:</p>
              {images.map((file, index) => (
                <p key={index}>{file.name}</p>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Save"}
        </button>
      </form>
    </Layout>
  );
};

export default AddStudent;
