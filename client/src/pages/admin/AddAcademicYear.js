import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import styles from "../../styles/AddAcademicYear.module.css";

const addAcademicYearSchema = Yup.object().shape({
  yearName: Yup.string()
    .required("The name of the academic year is mandatory.")
    .trim(),

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
    date.setMinutes(date.getMinutes() - offset); // compensăm fusul orar local
    return date.toISOString().split("T")[0]; // păstrăm doar YYYY-MM-DD
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
      navigate("/admin/academic");
    } catch (err) {
      setError(err.response?.data?.msg || "An unexpected error occurred");
      console.log(err.response?.data?.msg);
    }
  };

  return (
    <Layout>
      <div className={styles.addAcademicYearContainer}>
        <h2 className={styles.addAcademicYearTitle}>Add Academic Year</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <input type="hidden" {...register("firstSemesterName")} />
          <input type="hidden" {...register("secondSemesterName")} />

          <div className={styles.formColumns}>
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="yearName">Name:</label>
                <input
                  id="yearName"
                  {...register("yearName")}
                  placeholder="e.g. 2024-2025"
                />
                {errors.yearName && (
                  <p className={styles.error}>{errors.yearName.message}</p>
                )}
              </div>
            </div>

            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="yearStartDate">Start Date:</label>
                <input
                  type="date"
                  id="yearStartDate"
                  {...register("yearStartDate")}
                />
                {errors.yearStartDate && (
                  <p className={styles.error}>{errors.yearStartDate.message}</p>
                )}
              </div>
            </div>

            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="yearEndDate">End Date:</label>
                <input
                  type="date"
                  id="yearEndDate"
                  {...register("yearEndDate")}
                />
                {errors.yearEndDate && (
                  <p className={styles.error}>{errors.yearEndDate.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.semesterSection}>
            <h3 className={styles.semesterTitle}>First Semester</h3>
            <div className={styles.formColumns}>
              <div className={styles.formColumn}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstStartDate">Start Date:</label>
                  <input
                    type="date"
                    id="firstStartDate"
                    {...register("firstStartDate")}
                  />
                  {errors.firstStartDate && (
                    <p className={styles.error}>
                      {errors.firstStartDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.formColumn}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstEndDate">End Date:</label>
                  <input
                    type="date"
                    id="firstEndDate"
                    {...register("firstEndDate")}
                  />
                  {errors.firstEndDate && (
                    <p className={styles.error}>
                      {errors.firstEndDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.semesterSection}>
            <h3 className={styles.semesterTitle}>Second Semester</h3>
            <div className={styles.formColumns}>
              <div className={styles.formColumn}>
                <div className={styles.formGroup}>
                  <label htmlFor="secondStartDate">Start Date:</label>
                  <input
                    type="date"
                    id="secondStartDate"
                    {...register("secondStartDate")}
                  />
                  {errors.secondStartDate && (
                    <p className={styles.error}>
                      {errors.secondStartDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.formColumn}>
                <div className={styles.formGroup}>
                  <label htmlFor="secondEndDate">End Date:</label>
                  <input
                    type="date"
                    id="secondEndDate"
                    {...register("secondEndDate")}
                  />
                  {errors.secondEndDate && (
                    <p className={styles.error}>
                      {errors.secondEndDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.periodsSection}>
            <div className={styles.periodsSectionHeader}>
              <h3 className={styles.semesterTitle}>Periods</h3>
              <button
                type="button"
                className={styles.addPeriodButton}
                onClick={() =>
                  append({ type: "vacation", startDate: null, endDate: null })
                }
              >
                + Add Period
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className={styles.periodItem}>
                <div className={styles.periodHeader}>
                  <h4 className={styles.periodNumber}>Period {index + 1}</h4>
                  {index > 0 && (
                    <button
                      type="button"
                      className={styles.removePeriodButton}
                      onClick={() => remove(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className={styles.formColumns}>
                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label htmlFor={`periods.${index}.type`}>Type:</label>
                      <select
                        id={`periods.${index}.type`}
                        {...register(`periods.${index}.type`)}
                      >
                        <option value="vacation">Vacation</option>
                        <option value="exams">Exams</option>
                      </select>
                      {errors.periods?.[index]?.type && (
                        <p className={styles.error}>
                          {errors.periods[index].type.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label htmlFor={`periods.${index}.semesterRef`}>
                        Associate with:
                      </label>
                      <select
                        id={`periods.${index}.semesterRef`}
                        {...register(`periods.${index}.semesterRef`)}
                      >
                        <option value="">Intersemestrial</option>
                        <option value="first">Semestrul 1</option>
                        <option value="second">Semestrul 2</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label htmlFor={`periods.${index}.startDate`}>
                        Start Date:
                      </label>
                      <input
                        type="date"
                        id={`periods.${index}.startDate`}
                        {...register(`periods.${index}.startDate`)}
                      />
                      {errors.periods?.[index]?.startDate && (
                        <p className={styles.error}>
                          {errors.periods[index].startDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={styles.formColumn}>
                    <div className={styles.formGroup}>
                      <label htmlFor={`periods.${index}.endDate`}>
                        End Date:
                      </label>
                      <input
                        type="date"
                        id={`periods.${index}.endDate`}
                        {...register(`periods.${index}.endDate`)}
                      />
                      {errors.periods?.[index]?.endDate && (
                        <p className={styles.error}>
                          {errors.periods[index].endDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
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
