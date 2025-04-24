import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import useAxiosCustom from "../../hooks/useAxiosCustom";
import Layout from "../Layout";
import { createStudent } from "../../services/StudentService";
import styles from "../../styles/AddStudent.module.css";

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
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages((prevState) => [...prevState, ...newFiles]);
  };

  const uploadImages = async (images) => {
    const { data } = await axiosCustom.get("/cloudinary-signature");
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
        {
          method: "POST",
          body: formData,
        }
      );

      const fileData = await response.json();
      uploadedImageUrls.push(fileData.secure_url);
    }

    return uploadedImageUrls;
  };

  const addStudent = async (data) => {
    try {
      setUploading(true);
      let imageUrls = [];
      if (images.length > 0) {
        imageUrls = await uploadImages(images);
      }
      const studentData = await createStudent(axiosCustom, data, imageUrls);
      if (studentData) {
        navigate("/admin/students");
      }
    } catch (error) {
      setError(error.response?.data?.msg);
      console.error("Failed to create user", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Add Student</h1>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit(addStudent)}>
            <div className={styles.formColumns}>
              <div className={styles.formColumn}>
                <div className={styles.inputDiv}>
                  <label htmlFor="name">Name: </label>
                  <div className={styles.input}>
                    <input
                      {...register("name")}
                      id="name"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  {errors.name && (
                    <p className={styles.error}>{errors.name.message}</p>
                  )}
                </div>

                <div className={styles.inputDiv}>
                  <label htmlFor="email">Email: </label>
                  <div className={styles.input}>
                    <input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="e.g. johndoe@gmail.com"
                    />
                  </div>
                  {errors.email && (
                    <p className={styles.error}>{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className={styles.formColumn}>
                <div className={styles.inputDiv}>
                  <label htmlFor="date">Birth Date: </label>
                  <div className={styles.input}>
                    <input {...register("birthDate")} id="date" type="date" />
                  </div>
                  {errors.birthDate && (
                    <p className={styles.error}>{errors.birthDate.message}</p>
                  )}
                </div>

                <div className={styles.inputDiv}>
                  <label>Study Year: </label>
                  <div className={styles.input}>
                    <input
                      {...register("studyYear")}
                      type="number"
                      placeholder="e.g. 1"
                    />
                  </div>
                  {errors.studyYear && (
                    <p className={styles.error}>{errors.studyYear.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.inputDiv}>
              <label>Upload images:</label>
              <div className={styles.input}>
                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
              </div>
              {images.length > 0 && (
                <div className={styles.imagesContainer}>
                  <p className={styles.imagesTitle}>Selected images:</p>
                  {images.map((img, index) => (
                    <div key={index} className={styles.imageItem}>
                      {img.imageUrl ? (
                        <img
                          className={styles.imagePreview}
                          src={img.imageUrl}
                          alt="Existing image"
                        />
                      ) : (
                        <p>{img.name}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className={styles.btn} type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddStudent;
