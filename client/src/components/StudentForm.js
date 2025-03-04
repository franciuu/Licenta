import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  birthDate: Yup.date()
    .max(new Date(), "Birth date cannot be in the future")
    .required("Birth date is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  studyYear: Yup.number()
    .typeError("Study year must be a number")
    .integer("Study year must be an integer")
    .min(1, "Minimum study year is 1")
    .max(6, "Maximum study year is 6")
    .required("Study year is required"),
});

const StudentForm = ({ initialValues = {}, onSubmit, error }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const [images, setImages] = useState(initialValues.images || []);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages((prevState) => [...prevState, ...newFiles]);
  };

  useEffect(() => {
    if (initialValues?.birthDate) {
      const formattedValue = new Date(initialValues.birthDate)
        .toISOString()
        .split("T")[0];
      setValue("birthDate", formattedValue);
    }
  }, [initialValues, setValue]);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit({ ...data, images }))}>
      {error && <p className="error">{error}</p>}

      <div className="inputDiv">
        <label htmlFor="name">Name: </label>
        <div className="input">
          <input {...register("name")} id="name" placeholder="Name" />
        </div>
        <p>{errors.name?.message}</p>
      </div>

      <div className="inputDiv">
        <label htmlFor="date">Birth Date: </label>
        <div className="input">
          <input {...register("birthDate")} id="date" type="date" />
        </div>
        <p>{errors.date?.message}</p>
      </div>

      <div className="inputDiv">
        <label htmlFor="email">Email: </label>
        <div className="input">
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="Email"
          />
        </div>
        <p>{errors.email?.message}</p>
      </div>

      <div className="inputDiv">
        <label>Study year: </label>
        <div className="input">
          <input
            {...register("studyYear")}
            type="number"
            placeholder="Study Year"
          />
        </div>
        <p>{errors.year?.message}</p>
      </div>

      <div className="inputDiv">
        <label>Upload images:</label>
        <div className="input">
          <input
            id="upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </div>
        {images.length > 0 && (
          <div>
            <p>Selected images:</p>
            {images.map((img, index) => (
              <div key={index}>
                {img.imageUrl ? (
                  <img width={105} src={img.imageUrl} alt="Existing image" />
                ) : (
                  <p>{img.name}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Save"}
      </button>
    </form>
  );
};

export default StudentForm;
