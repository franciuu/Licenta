"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";

const addAcademicYearSchema = Yup.object().shape({
  yearName: Yup.string()
    .trim()
    .required("The name of the academic year is mandatory."),
  yearStartDate: Yup.date()
    .required("Start date is required.")
    .typeError("The start date must be a valid date."),
  yearEndDate: Yup.date()
    .required("End date is required.")
    .typeError("The end date must be a valid date.")
    .min(
      Yup.ref("yearStartDate"),
      "Academic year end must be after start date."
    ),
  firstSemesterName: Yup.string().default("Sem I"),
  firstStartDate: Yup.date()
    .required("Start date is required.")
    .typeError("The start date must be a valid date."),
  firstEndDate: Yup.date()
    .required("The end date is required.")
    .typeError("The end date must be a valid date.")
    .min(
      Yup.ref("firstStartDate"),
      "The end date must be after the start date."
    ),
  secondSemesterName: Yup.string().default("Sem II"),
  secondStartDate: Yup.date()
    .nullable()
    .min(
      Yup.ref("firstEndDate"),
      "Second semester start must be after first semester end"
    )
    .max(
      Yup.ref("secondEndDate"),
      "Second semester start must be before its end date"
    )
    .required("Second semester start date is required"),
  secondEndDate: Yup.date()
    .nullable()
    .min(
      Yup.ref("secondStartDate"),
      "Second semester end must be after its start date"
    )
    .max(
      Yup.ref("yearEndDate"),
      "Second semester end cannot be after academic year end"
    )
    .required("Second semester end date is required"),
  periods: Yup.array().of(
    Yup.object().shape({
      type: Yup.string()
        .oneOf(["vacation", "exams"])
        .required("Type is required."),
      startDate: Yup.date()
        .required("The start date of the period is mandatory.")
        .typeError("The period start date must be a valid date."),
      endDate: Yup.date()
        .required("The end date of the period is mandatory.")
        .typeError("The period end date must be a valid date.")
        .min(
          Yup.ref("startDate"),
          "The end date of the period must be after the start date."
        ),
      semesterRef: Yup.string().oneOf(["", "first", "second"]),
    })
  ),
});

const AddAcademicYear = () => {
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();
  const [error, setError] = useState(null);
  const formatLocalDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    return date.toISOString().split("T")[0];
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(addAcademicYearSchema),
    defaultValues: {
      yearName: "",
      yearStartDate: null,
      yearEndDate: null,
      firstSemesterName: "Sem I",
      firstStartDate: null,
      firstEndDate: null,
      secondSemesterName: "Sem II",
      secondStartDate: null,
      secondEndDate: null,
      periods: [{ type: "vacation", startDate: null, endDate: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "periods",
  });

  const onSubmit = async (data) => {
    setError(null);
    console.log(data);
    try {
      const yearPayload = {
        name: data.yearName,
        startDate: formatLocalDate(data.yearStartDate),
        endDate: formatLocalDate(data.yearEndDate),
      };
      const response = await axiosCustom.post("/academic-years", yearPayload);
      const idAcademicYear = response.data.uuid;

      const semestersPayload = [
        {
          name: data.firstSemesterName,
          startDate: formatLocalDate(data.firstStartDate),
          endDate: formatLocalDate(data.firstEndDate),
          idAcademicYear,
        },
        {
          name: data.secondSemesterName,
          startDate: formatLocalDate(data.secondStartDate),
          endDate: formatLocalDate(data.secondEndDate),
          idAcademicYear,
        },
      ];

      const semestersResponses = await Promise.all(
        semestersPayload.map((sem) => axiosCustom.post("/semesters", sem))
      );
      const firstSemesterId = semestersResponses[0].data.uuid;
      const secondSemesterId = semestersResponses[1].data.uuid;

      if (data.periods && data.periods.length > 0) {
        const periodsPayload = data.periods.map((period) => {
          let idSemester = null;
          if (period.semesterRef === "first") idSemester = firstSemesterId;
          if (period.semesterRef === "second") idSemester = secondSemesterId;
          return {
            type: period.type,
            startDate: formatLocalDate(period.startDate),
            endDate: formatLocalDate(period.endDate),
            idAcademicYear,
            idSemester,
          };
        });

        await Promise.all(
          periodsPayload.map((period) => axiosCustom.post("/periods", period))
        );
      }
      navigate("/settings");
    } catch (err) {
      setError(err.response?.data?.msg || "An unexpected error occurred");
      console.log(err.response?.data?.msg);
    }
  };

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto my-8 p-6 md:p-8 bg-white/50 backdrop-blur-xl rounded-lg shadow-sm border-2 border-white/60">
        <h2 className="text-xl text-gray-800 font-semibold mb-6 pb-3 border-b-2 border-purple-500/40 flex items-center">
          Add Academic Year
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50/80 text-red-500 p-2.5 rounded-md mb-5 border-l-3 border-red-500">
              {error}
            </div>
          )}

          <input type="hidden" {...register("firstSemesterName")} />
          <input type="hidden" {...register("secondSemesterName")} />

          <div className="bg-white/60 rounded-lg border border-purple-500/30 p-5 mb-6">
            <h3 className="text-lg text-purple-600 mb-4 font-medium">
              Academic Year Details
            </h3>

            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex-1 min-w-0">
                <div>
                  <label
                    htmlFor="yearName"
                    className="block font-medium text-gray-700 text-sm mb-1.5"
                  >
                    Name:
                  </label>
                  <input
                    id="yearName"
                    {...register("yearName")}
                    placeholder="e.g. 2024-2025"
                    className="w-full px-3 py-2.5 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                  />
                  {errors.yearName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.yearName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div>
                  <label
                    htmlFor="yearStartDate"
                    className="block font-medium text-gray-700 text-sm mb-1.5"
                  >
                    Start Date:
                  </label>
                  <input
                    type="date"
                    id="yearStartDate"
                    {...register("yearStartDate")}
                    className="w-full px-3 py-2.5 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                  />
                  {errors.yearStartDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.yearStartDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div>
                  <label
                    htmlFor="yearEndDate"
                    className="block font-medium text-gray-700 text-sm mb-1.5"
                  >
                    End Date:
                  </label>
                  <input
                    type="date"
                    id="yearEndDate"
                    {...register("yearEndDate")}
                    className="w-full px-3 py-2.5 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                  />
                  {errors.yearEndDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.yearEndDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/60 rounded-lg border border-purple-500/30 p-5 mb-6">
            <h3 className="text-lg text-purple-600 mb-4 font-medium">
              Semesters
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/50 rounded-md p-4 border border-purple-500/20">
                <h4 className="text-base text-purple-600 mb-3 font-medium">
                  First Semester
                </h4>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="firstStartDate"
                      className="block font-medium text-gray-700 text-sm mb-1.5"
                    >
                      Start Date:
                    </label>
                    <input
                      type="date"
                      id="firstStartDate"
                      {...register("firstStartDate")}
                      className="w-full px-3 py-2.5 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                    />
                    {errors.firstStartDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstStartDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="firstEndDate"
                      className="block font-medium text-gray-700 text-sm mb-1.5"
                    >
                      End Date:
                    </label>
                    <input
                      type="date"
                      id="firstEndDate"
                      {...register("firstEndDate")}
                      className="w-full px-3 py-2.5 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                    />
                    {errors.firstEndDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstEndDate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-md p-4 border border-purple-500/20">
                <h4 className="text-base text-purple-600 mb-3 font-medium">
                  Second Semester
                </h4>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="secondStartDate"
                      className="block font-medium text-gray-700 text-sm mb-1.5"
                    >
                      Start Date:
                    </label>
                    <input
                      type="date"
                      id="secondStartDate"
                      {...register("secondStartDate")}
                      className="w-full px-3 py-2.5 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                    />
                    {errors.secondStartDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.secondStartDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="secondEndDate"
                      className="block font-medium text-gray-700 text-sm mb-1.5"
                    >
                      End Date:
                    </label>
                    <input
                      type="date"
                      id="secondEndDate"
                      {...register("secondEndDate")}
                      className="w-full px-3 py-2.5 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                    />
                    {errors.secondEndDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.secondEndDate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/60 rounded-lg border border-purple-500/30 p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
              <h3 className="text-lg text-purple-600 font-medium">Periods</h3>
              <button
                type="button"
                className="mt-2 sm:mt-0 bg-purple-600 text-white border-none rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-purple-700"
                onClick={() =>
                  append({ type: "vacation", startDate: null, endDate: null })
                }
              >
                + Add Period
              </button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-white/40 border border-purple-500/20 rounded-lg p-4 mb-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-base text-purple-600 font-medium">
                    Period {index + 1}
                  </h4>
                  {index > 0 && (
                    <button
                      type="button"
                      className="bg-red-50 text-red-500 border border-red-300 rounded px-2.5 py-1 text-xs transition-all hover:bg-red-100"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`periods.${index}.type`}
                        className="block font-medium text-gray-700 text-sm mb-1.5"
                      >
                        Type:
                      </label>
                      <select
                        id={`periods.${index}.type`}
                        {...register(`periods.${index}.type`)}
                        className="w-full px-3 py-2.5 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                      >
                        <option value="vacation">Vacation</option>
                        <option value="exams">Exams</option>
                      </select>
                      {errors.periods?.[index]?.type && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.periods[index].type.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`periods.${index}.semesterRef`}
                        className="block font-medium text-gray-700 text-sm mb-1.5"
                      >
                        Associate with:
                      </label>
                      <select
                        id={`periods.${index}.semesterRef`}
                        {...register(`periods.${index}.semesterRef`)}
                        className="w-full px-3 py-2.5 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                      >
                        <option value="">Intersemestrial</option>
                        <option value="first">Semestrul 1</option>
                        <option value="second">Semestrul 2</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`periods.${index}.startDate`}
                        className="block font-medium text-gray-700 text-sm mb-1.5"
                      >
                        Start Date:
                      </label>
                      <input
                        type="date"
                        id={`periods.${index}.startDate`}
                        {...register(`periods.${index}.startDate`)}
                        className="w-full px-3 py-2.5 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                      />
                      {errors.periods?.[index]?.startDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.periods[index].startDate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`periods.${index}.endDate`}
                        className="block font-medium text-gray-700 text-sm mb-1.5"
                      >
                        End Date:
                      </label>
                      <input
                        type="date"
                        id={`periods.${index}.endDate`}
                        {...register(`periods.${index}.endDate`)}
                        className="w-full px-3 py-2.5 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
                      />
                      {errors.periods?.[index]?.endDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.periods[index].endDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-purple-600 text-white border-none rounded-md px-6 py-2.5 text-sm font-medium cursor-pointer transition-all shadow-sm shadow-purple-500/10 hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-500/20 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddAcademicYear;
