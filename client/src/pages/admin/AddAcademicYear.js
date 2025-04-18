import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import styles from "../../styles/AddAcademicYear.module.css";

const addAcademicYearSchema = Yup.object().shape({
  yearName: Yup.string().required("Name is required"),
  yearStartDate: Yup.date()
    .nullable()
    .max(Yup.ref("yearEndDate"), "Academic year start must be before end date")
    .required("Start date is required"),
  yearEndDate: Yup.date()
    .nullable()
    .min(Yup.ref("yearStartDate"), "Academic year end must be after start date")
    .required("End date is required"),
  firstStartDate: Yup.date()
    .nullable()
    .min(
      Yup.ref("yearStartDate"),
      "First semester start cannot be before academic year start"
    )
    .max(
      Yup.ref("firstEndDate"),
      "First semester start must be before its end date"
    )
    .required("First semester start date is required"),
  firstEndDate: Yup.date()
    .nullable()
    .min(
      Yup.ref("firstStartDate"),
      "First semester end must be after its start date"
    )
    .max(
      Yup.ref("yearEndDate"),
      "First semester end cannot be after academic year end"
    )
    .required("First semester end date is required"),
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
});

const AddAcademicYear = () => {
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
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
    },
  });

  const onSubmit = async (data) => {
    setError(null);
    try {
      const yearPayload = {
        name: data.yearName,
        startDate: data.yearStartDate,
        endDate: data.yearEndDate,
      };
      const response = await axiosCustom.post("/academic-years", yearPayload);
      const idAcademicYear = response.data.uuid;

      const semestersPayload = [
        {
          name: data.firstSemesterName,
          startDate: data.firstStartDate,
          endDate: data.firstEndDate,
          idAcademicYear,
        },
        {
          name: data.secondSemesterName,
          startDate: data.secondStartDate,
          endDate: data.secondEndDate,
          idAcademicYear,
        },
      ];

      await Promise.all(
        semestersPayload.map((sem) => axiosCustom.post("/semesters", sem))
      );

      navigate("/admin/academic");
    } catch (err) {
      setError(err.response?.data?.msg || "An unexpected error occurred");
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
