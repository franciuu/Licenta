import { useState } from "react";
import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/AddAcademicYear.module.css";

const AddAcademicYear = () => {
  const [formData, setFormData] = useState({
    yearName: "",
    yearStartDate: "",
    yearEndDate: "",
    firstSemesterName: "Sem I",
    firstStartDate: "",
    firstEndDate: "",
    secondSemesterName: "Sem II",
    secondStartDate: "",
    secondEndDate: "",
  });
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const yearPayload = {
        name: formData.yearName,
        startDate: formData.yearStartDate,
        endDate: formData.yearEndDate,
      };
      const response = await axiosCustom.post("/academic-years", yearPayload);
      const idAcademicYear = response.data.uuid;

      const semestersPayload = [
        {
          name: formData.firstSemesterName,
          startDate: formData.firstStartDate,
          endDate: formData.firstEndDate,
          idAcademicYear: idAcademicYear,
        },
        {
          name: formData.secondSemesterName,
          startDate: formData.secondStartDate,
          endDate: formData.secondEndDate,
          idAcademicYear: idAcademicYear,
        },
      ];

      await Promise.all(
        semestersPayload.map((sem) => axiosCustom.post("/semesters", sem))
      );
      navigate("/admin/academic");
    } catch (error) {
      console.log("Failed to create academic year", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <Layout>
      <div className={styles.addAcademicYearContainer}>
        <h2 className={styles.addAcademicYearTitle}>Add Academic Year</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formColumns}>
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="yearName">Name:</label>
                <input
                  id="yearName"
                  value={formData.yearName}
                  onChange={handleChange}
                  placeholder="e.g. 2024-2025"
                  required
                />
              </div>
            </div>
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="yearStartDate">Start Date:</label>
                <input
                  type="date"
                  value={formData.yearStartDate}
                  onChange={handleChange}
                  id="yearStartDate"
                  required
                />
              </div>
            </div>
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="yearEndDate">End Date:</label>
                <input
                  type="date"
                  value={formData.yearEndDate}
                  onChange={handleChange}
                  id="yearEndDate"
                  required
                />
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
                    value={formData.firstStartDate}
                    onChange={handleChange}
                    id="firstStartDate"
                    required
                  />
                </div>
              </div>
              <div className={styles.formColumn}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstEndDate">End Date:</label>
                  <input
                    type="date"
                    value={formData.firstEndDate}
                    onChange={handleChange}
                    id="firstEndDate"
                    required
                  />
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
                    value={formData.secondStartDate}
                    onChange={handleChange}
                    id="secondStartDate"
                    required
                  />
                </div>
              </div>
              <div className={styles.formColumn}>
                <div className={styles.formGroup}>
                  <label htmlFor="secondEndDate">End Date:</label>
                  <input
                    type="date"
                    value={formData.secondEndDate}
                    onChange={handleChange}
                    id="secondEndDate"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              Save
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
export default AddAcademicYear;
