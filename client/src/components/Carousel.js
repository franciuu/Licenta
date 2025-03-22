import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/MyCarousel.module.css";

const MyCarousel = ({ urls }) => {
  return (
    <div className={styles.carouselContainer}>
      <Carousel indicators={false} className={styles.customCarousel}>
        {urls.map((u, index) => (
          <Carousel.Item key={index}>
            <div className={styles.imageWrapper}>
              <img
                src={u}
                alt={`Slide ${index + 1}`}
                className={styles.carouselImage}
              />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default MyCarousel;
