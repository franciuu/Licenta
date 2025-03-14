import { useState, useEffect } from "react";
import Layout from "./Layout";
import MyCarousel from "../components/Carousel";
import useAxiosCustom from "../hooks/useAxiosCustom";
import { useParams } from "react-router-dom";
import { getStudentById } from "../services/StudentService";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const ViewStudent = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [student, setStudent] = useState(null);
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchStudent = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const studentData = await getStudentById(axiosCustom, id);
        setStudent(studentData);
      } catch (error) {
        if (error.response?.status === 404) {
          navigate("/404");
        }
        console.error("Failed to fetch student data", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    fetchStudent();
  }, [navigate, axiosCustom, id]);

  if (loadingCount > 0)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      {student ? (
        <div>
          <h1>{student.name}'s profile</h1>
          <p>{student.birthDate}</p>
          <p>{student.email}</p>
          <p>{student.studyYear}</p>
          {student.images?.length > 0 ? (
            <MyCarousel urls={student.images.map((img) => img.imageUrl)} />
          ) : (
            <p>No images available</p>
          )}
        </div>
      ) : (
        <p>Not found</p>
      )}
    </Layout>
  );
};
export default ViewStudent;
