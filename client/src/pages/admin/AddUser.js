import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import useAxiosCustom from "../../hooks/useAxiosCustom";
import Layout from "../Layout";

const addUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: Yup.mixed()
    .oneOf(["admin", "professor"], "Invalid role")
    .required("Role is required"),
});

const AddUser = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addUserSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosCustom.post("/users", data);
      if (response?.data) {
        navigate("/admin/users");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "An unexpected error occurred");
    }
  };

  return (
    <Layout>
      <div className="max-w-[800px] mx-auto my-10 p-4 md:p-6 bg-white/50 backdrop-blur-xl rounded-lg shadow-sm border-2 border-white/60">
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate("/admin/users");
          }}
          className="text-sm text-purple-600 hover:text-purple-800 mb-3 transition-colors"
        >
          ← Back to Users
        </button>
        <h1 className="text-lg text-gray-800 font-semibold mb-3 pb-2 border-b-2 border-purple-500/40">
          Add User
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mb-0">
          {error && (
            <div className="bg-red-50/80 text-red-500 p-3 rounded-md mb-4 border-l-3 border-red-500">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-4">
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
                  placeholder="e.g. John Doe"
                  {...register("name")}
                  className="px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="font-medium text-gray-700 text-sm mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. johndoe@gmail.com"
                  {...register("email")}
                  className="px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="role"
                  className="font-medium text-gray-700 text-sm mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  {...register("role")}
                  className="px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                >
                  <option value="admin">Admin</option>
                  <option value="professor">Professor</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="font-medium text-gray-700 text-sm mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="confirmPassword"
                  className="font-medium text-gray-700 text-sm mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
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

export default AddUser;
