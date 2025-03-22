import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import Layout from "../Layout";
import StudentForm from "../../components/StudentForm";
import { createStudent } from "../../services/StudentService";

const AddStudent = () => {
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();
  const [error, setError] = useState(null);

  const addStudent = async (data) => {
    try {
      let imageUrls = [];
      if (data.images.length > 0) {
        imageUrls = await uploadImages(data.images);
      }
      const studentData = await createStudent(axiosCustom, data, imageUrls);
      if (studentData) {
        navigate("/students");
      }
    } catch (error) {
      setError(error.response?.data?.msg);
      console.error("Failed to create user", error);
    }
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

  return (
    <Layout>
      <h1>Add Student</h1>
      <StudentForm onSubmit={addStudent} error={error} />
    </Layout>
  );
};

export default AddStudent;
