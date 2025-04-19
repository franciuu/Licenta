import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";

import { generatePatternImage } from "../utils/GeneratePattern.js";
import useAxiosCustom from "../hooks/useAxiosCustom.js";
import { deleteActivity } from "../services/ActivityService.js";
import styles from "../styles/ActivityCard.module.css";

const ActivityCard = ({ info, onDeleted }) => {
  const axiosCustom = useAxiosCustom();

  const onDelete = (uuid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteActivity(axiosCustom, uuid);
          Swal.fire({
            title: "Deleted!",
            text: "Activity has been deleted.",
            icon: "success",
          });
          if (onDeleted) {
            onDeleted();
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

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
            className={styles.viewText}
          >
            View
          </Link>
        </button>
        <button
          className={styles.viewButton}
          onClick={() => onDelete(info.uuid)}
        >
          <span className={styles.viewText}>Delete</span>
        </button>
      </Card.Body>
    </Card>
  );
};

export default ActivityCard;
