import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import useAxiosCustom from "../../hooks/useAxiosCustom";
import { updateStudent, getStudentById } from "../../services/StudentService";
import Layout from "../Layout";
import Uploader from "../../components/admin/Uploader";
import styles from "../../styles/EditStudent.module.css";

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

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();
  const [files, setFiles] = useState([]);
  const [initialUrls, setInitialUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudentById(axiosCustom, id);
        reset({
          name: data.name,
          birthDate: data.birthDate.split("T")[0],
          email: data.email,
          studyYear: data.studyYear,
        });
        setInitialUrls(data.images.map((img) => img.imageUrl));
      } catch (err) {
        console.error(err);
        setError("Eroare la încărcarea studentului");
      }
    };
    fetchStudent();
  }, [id, reset, axiosCustom]);

  const uploadImages = async (files) => {
    const { data } = await axiosCustom.get("/cloudinary-signature");
    const uploaded = [];

    for (const pondFile of files) {
      const file = pondFile.file;
      if (!file) continue;

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
      uploaded.push(fileData.secure_url);
    }

    return uploaded;
  };

  const onSubmit = async (formData) => {
    const existingUrls = files
      .filter(
        (f) => typeof f.source === "string" && f.source.startsWith("http")
      )
      .map((f) => f.source);
    const deletedImages = initialUrls.filter(
      (url) => !existingUrls.includes(url)
    );
    const newFiles = files.filter(
      (f) => f?.file && !existingUrls.includes(f.source)
    );
    const uploaded = await uploadImages(newFiles);

    try {
      setLoading(true);
      await updateStudent(axiosCustom, id, {
        ...formData,
        uploadedImages: uploaded,
        deletedImages: deletedImages,
      });
      navigate("/admin/students");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Edit Student</h1>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                      type="e.g. johndoe@gmail.com"
                      placeholder="Email"
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
                  <label label="studyYear">Study Year: </label>
                  <div className={styles.input}>
                    <input
                      {...register("studyYear")}
                      type="number"
                      id="studyYear"
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
              <label id="upload">Upload images:</label>
              <Uploader
                id="upload"
                files={files}
                setFiles={setFiles}
                initialUrls={initialUrls}
              />
            </div>

            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditStudent;
