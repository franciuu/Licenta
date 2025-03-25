import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { generatePatternImage } from "../utils/GeneratePattern.js";
import styles from "../styles/ActivityCard.module.css";

const ActivityCard = ({ info }) => {
  return (
    <Card className={styles.activityCard}>
      <div className={styles.imageContainer}>
        <Card.Img
          variant="top"
          src={generatePatternImage()}
          alt="Pattern image"
          className={styles.cardImage}
        />
        <div className={styles.overlay} />
        <Card.Title className={styles.cardTitle}>{info.name}</Card.Title>
      </div>
      <Card.Body className={styles.cardBody}>
        <button className={styles.viewButton}>
          <Link
            to={`/admin/activities/${info.uuid}`}
            className={styles.viewLink}
          >
            View
          </Link>
        </button>
      </Card.Body>
    </Card>
  );
};

export default ActivityCard;
