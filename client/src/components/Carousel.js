import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";

const MyCarousel = ({ urls }) => {
  return (
    <Carousel>
      {urls.map((u, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={u}
            alt={`Slide ${index + 1}`}
            style={{ height: "400px", objectFit: "cover" }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default MyCarousel;
