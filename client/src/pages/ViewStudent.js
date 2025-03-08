import { useState, useEffect } from "react";
import Layout from "./Layout";
import MyCarousel from "../components/Carousel";
import useAxiosCustom from "../hooks/useAxiosCustom";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const ViewStudent = () => {
  const [student, setStudent] = useState(null);
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const getStudent = async () => {
    try {
      const response = await axiosCustom.get(`/students/${id}`);
      setStudent(response.data);
    } catch (error) {
      console.error(
        "Error fetching student:",
        error.response?.data || error.message
      );
      // navigate("/", { state: { from: location }, replace: true });
    }
  };

  useEffect(() => {
    getStudent();
  }, []);

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
