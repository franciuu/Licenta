import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Layout from "../Layout";
import { createCourse } from "../../services/CourseService";

const schema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  program: Yup.mixed()
    .oneOf(["Bachelor", "Master"], "Invalid program")
    .required("Program level is required"),
});

const AddCourse = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [formData, setFormData] = useState({
    name: "",
    program: "Bachelor",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const addCourse = async () => {
    try {
      const courseData = createCourse(axiosCustom, formData);
      if (courseData) {
        navigate("/admin/courses");
      }
    } catch (error) {
      setError(error.response?.data?.msg);
      console.error("Failed to create activity", error);
    }
  };

  return (
    <Layout>
      <div className="max-w-[800px] mx-auto my-10 p-4 md:p-6 bg-white/50 backdrop-blur-xl rounded-lg shadow-sm border-2 border-white/60">
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate("/admin/courses");
          }}
          className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 mb-3 transition-colors"
        >
          ← Back to Courses
        </button>
        <h1 className="text-lg text-gray-800 font-semibold mb-3 pb-2 border-b-2 border-purple-500/40">
          Add Course
        </h1>

        {error && (
          <div className="bg-red-50/80 text-red-500 p-3 rounded-md mb-4 border-l-3 border-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(addCourse)} className="mb-0">
          <div className="mb-4">
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
                placeholder="Course Name"
                {...register("name")}
                value={formData.name}
                onChange={handleChange}
                className="px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-col">
              <label
                htmlFor="program"
                className="font-medium text-gray-700 text-sm mb-1"
              >
                Program
              </label>
              <select
                id="program"
                {...register("program")}
                value={formData.program}
                onChange={handleChange}
                className="px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
              >
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
              </select>
              {errors.program && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.program.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white border-none rounded-md px-5 py-2 text-sm font-medium cursor-pointer transition-all shadow-sm shadow-purple-500/10 mt-3 block ml-auto hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-500/20 active:translate-y-0.5"
          >
            Save
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddCourse;
