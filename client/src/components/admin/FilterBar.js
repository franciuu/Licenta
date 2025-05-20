import { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import styles from "../../styles/FilterBar.module.css";

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    name: "",
    programLevel: "",
  });

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const levels = ["Bachelor", "Master"];

  return (
    <div className={styles.filterBar}>
      <Row className="w-100">
        <Col xs={12} md={7} className="mb-3 mb-md-0">
          <Form.Group>
            <div className={styles.inputWrapper}>
              <i className={`bi bi-search ${styles.searchIcon}`}></i>
              <Form.Control
                type="text"
                placeholder="Search by course name..."
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </Form.Group>
        </Col>

        <Col xs={12} md={5}>
          <Form.Group>
            <Form.Select
              value={filters.programLevel}
              onChange={(e) =>
                handleFilterChange("programLevel", e.target.value)
              }
              className={styles.selectInput}
            >
              <option value="">All Levels</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default FilterBar;
