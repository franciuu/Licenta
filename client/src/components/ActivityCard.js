import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { generatePatternImage } from "../utils/GeneratePattern.js";

const ActivityCard = ({ info }) => {
  return (
    <Card
      style={{
        width: "18rem",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        transition: "transform 0.2s ease-in-out",
      }}
      className="activity-card"
    >
      <div style={{ position: "relative" }}>
        <Card.Img
          variant="top"
          src={generatePatternImage()}
          alt="Pattern image"
          style={{ height: "150px", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8))",
          }}
        />
        <Card.Title
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            fontSize: "1.2rem",
            fontWeight: "bold",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          {info.name}
        </Card.Title>
      </div>
      <Card.Body style={{ backgroundColor: "#f8f9fa", padding: "15px" }}>
        <Card.Subtitle
          className="mb-2 text-muted"
          style={{ fontSize: "0.9rem", fontWeight: "500" }}
        >
          {info.room}
        </Card.Subtitle>
        <Card.Text>
          {info.startTime} - {info.endTime}
        </Card.Text>
        <button>
          <Link to={`/admin/activities/${info.uuid}`}>View</Link>
        </button>
      </Card.Body>
    </Card>
  );
};

export default ActivityCard;
