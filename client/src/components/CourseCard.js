import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { generatePatternImage } from "../utils/GeneratePattern.js";
import styles from "../styles/CourseCard.module.css";

const CourseCard = ({ info }) => {
  return (
    <Card className={styles.courseCard}>
      <Card.Img
        variant="top"
        src={generatePatternImage()}
        alt="Pattern image"
        className={styles.cardImage}
      />
      <Card.Body className={styles.cardBody}>
        <Card.Title className={styles.cardTitle}>{info.name}</Card.Title>
        <Card.Subtitle className={styles.cardSubtitle}>
          {info.programLevel}
        </Card.Subtitle>
        <button className={styles.viewButton}>
          <Link to={`/admin/courses/${info.uuid}`} className={styles.viewLink}>
            View
          </Link>
        </button>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
