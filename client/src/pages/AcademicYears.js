import { useState, useEffect } from "react";
import Layout from "./Layout";
import useAxiosCustom from "../hooks/useAxiosCustom";
import { getAcademicYears } from "../services/AcademicYearService";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import styles from "../styles/AcademicYears.module.css";

const AcademicYears = () => {
  const [years, setYears] = useState([]);
  const axiosCustom = useAxiosCustom();

  useEffect(() => {
    const fetchYearsData = async () => {
      try {
        const yearsData = await getAcademicYears(axiosCustom);
        setYears(yearsData);
        console.log(yearsData);
      } catch (error) {
        console.error("Failed to fetch academic years data", error);
      }
    };

    fetchYearsData();
  }, []);

  const handleAddYear = () => {
    // Function to handle adding a new academic year
    console.log("Add new academic year");
    // Implementation will go here
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>Academic Years</h1>
          <button onClick={handleAddYear} className={styles.addButton}>
            <span className={styles.addIcon}>+</span>
            Add Year
          </button>
        </div>
        <Accordion
          allowZeroExpanded={true}
          className={styles.accordionContainer}
        >
          {years.map((y) => (
            <AccordionItem key={y.uuid} uuid={y.uuid}>
              <AccordionItemHeading>
                <AccordionItemButton className={styles.yearHeader}>
                  <span className={styles.yearName}>{y.name}</span>
                  <span className={styles.yearDuration}>
                    <span className={styles.yearDates}>
                      {y.startDate} - {y.endDate}
                    </span>
                  </span>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                {y.semesters.map((s) => (
                  <div key={s.uuid} className={styles.semesterItem}>
                    <span className={styles.semesterName}>{s.name}</span>
                    <span className={styles.semesterDates}>
                      {s.startDate} - {s.endDate}
                    </span>
                  </div>
                ))}
              </AccordionItemPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Layout>
  );
};

export default AcademicYears;
