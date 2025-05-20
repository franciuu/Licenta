import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Layout from "../Layout";
import CourseCard from "../../components/admin/CourseCard.js";
import FilterBar from "../../components/admin/FilterBar.js";
import useAxiosCustom from "../../hooks/useAxiosCustom.js";
import { getCourses } from "../../services/CourseService.js";
import Loader from "../../components/Loader.js";

const Courses = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    programLevel: "",
  });
  const axiosCustom = useAxiosCustom();

  useEffect(() => {
    const fetchCoursesData = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const coursesData = await getCourses(axiosCustom);
        setCourses(coursesData);
        setFilteredCourses(coursesData);
      } catch (error) {
        console.error("Failed to fetch courses data", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    fetchCoursesData();
  }, [axiosCustom]);

  useEffect(() => {
    let result = [...courses];

    if (filters.name) {
      result = result.filter((course) =>
        course.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.programLevel) {
      result = result.filter(
        (course) => course.programLevel === filters.programLevel
      );
    }

    setFilteredCourses(result);
  }, [filters, courses]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            List of Courses
          </h1>
          <Link
            to="/admin/courses/add"
            className="bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-2 px-4 rounded shadow hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow transition-all duration-300 flex items-center gap-2 h-10 self-start mb-4"
          >
            <span className="mr-1 font-bold">+</span>
            Add course
          </Link>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <FilterBar onFilterChange={handleFilterChange} />
          <span className="text-sm text-gray-600 whitespace-nowrap mt-2 md:mt-0">
            Showing {filteredCourses.length} of {courses.length} courses
          </span>
        </div>

        {filteredCourses?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <div key={course.uuid} className="h-full">
                <CourseCard info={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">No courses match your filters.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Courses;
