import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosCustom from "../hooks/useAxiosCustom";
import Layout from "./Layout";
import StudentForm from "../components/StudentForm";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axiosCustom.get(`/students/${id}`);
        setStudent(response.data);
      } catch (err) {
        setError("Error fetching student data");
      }
    };

    fetchStudent();
  }, [id, axiosCustom]);

  const updateStudent = async (data) => {
    try {
      const newImages = data.images.filter((img) => img instanceof File);
      console.log(newImages);
      let imageUrls = [];
      if (newImages.length > 0) {
        imageUrls = await uploadImages(newImages);
      }

      const response = await axiosCustom.put(`/students/${id}`, {
        ...data,
        images: imageUrls,
      });
      if (response?.data) {
        navigate("/students");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "An unexpected error occurred");
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

  if (!student) return <p>Loading...</p>;

  return (
    <Layout>
      <h1>Edit Student</h1>
      <StudentForm
        initialValues={student}
        onSubmit={updateStudent}
        error={error}
      />
    </Layout>
  );
};

export default EditStudent;
