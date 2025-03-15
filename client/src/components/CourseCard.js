import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { generatePatternImage } from "../utils/GeneratePattern.js";

const CourseCard = ({ info }) => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img
        variant="top"
        src={generatePatternImage()}
        alt="Pattern image"
      />
      <Card.Body>
        <Card.Title>{info.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {info.programLevel}
        </Card.Subtitle>
        <button>
          <Link to={`/admin/courses/${info.uuid}`}>View</Link>
        </button>
      </Card.Body>
    </Card>
  );
};
export default CourseCard;
