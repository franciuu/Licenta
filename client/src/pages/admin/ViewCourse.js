import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import useAxiosCustom from "../../hooks/useAxiosCustom";
import Layout from "../Layout";
import ActivityCard from "../../components/admin/ActivityCard.js";
import { getCourseById } from "../../services/CourseService.js";
import { getActivitesByCourse } from "../../services/ActivityService.js";
import Loader from "../../components/Loader.js";

const ViewCourse = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [course, setCourse] = useState({});
  const [activities, setActivities] = useState([]);
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const { id } = useParams();

  const onDelete = (uuid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosCustom.delete(`/courses/${uuid}`);
          Swal.fire({
            title: "Deleted!",
            text: "Course has been deleted.",
            icon: "success",
          });
          navigate("/admin/courses");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const fetchCourseData = async () => {
    setLoadingCount((prev) => prev + 1);
    try {
      const courseData = await getCourseById(axiosCustom, id);
      setCourse(courseData);
    } catch (error) {
      if (error.response?.status === 404) {
        navigate("/404");
      }
      console.error("Failed to fetch course data", error);
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  };

  const fetchActivitiesData = async () => {
    setLoadingCount((prev) => prev + 1);
    try {
      const activitiesData = await getActivitesByCourse(axiosCustom, id);
      setActivities(activitiesData);
    } catch (error) {
      console.error("Failed to fetch activities data", error);
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  };

  useEffect(() => {
    fetchCourseData();
    fetchActivitiesData();
  }, []);

  const renderActivities = () => {
    if (activities.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600">
            No activities available for this course yet.
          </p>
        </div>
      );
    }

    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activities.map((activ) => (
            <div key={activ.uuid} className="mb-4">
              <ActivityCard info={activ} onDeleted={fetchActivitiesData} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loadingCount > 0)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      <div className="p-4 sm:p-5 h-full flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4 py-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {course.name}
            </h1>
            <p className="text-sm text-purple-600 font-medium">
              {course.programLevel}
            </p>
          </div>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mb-4 h-10"
            onClick={() => onDelete(course.uuid)}
          >
            Delete course
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
            Course Activities
          </h2>
          {renderActivities()}
        </div>
      </div>
    </Layout>
  );
};

export default ViewCourse;
