import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const addUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: Yup.mixed()
    .oneOf(["admin", "professor"], "Invalid role")
    .required("Role is required"),
});

const editUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.mixed()
    .oneOf(["admin", "professor"], "Invalid role")
    .required("Role is required"),
});

const UserForm = ({ initialValues = {}, onSubmit, error, isEdit = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isEdit ? editUserSchema : addUserSchema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <p className="error">{error}</p>}

      <div className="inputDiv">
        <label htmlFor="name">Name: </label>
        <div className="input">
          <input
            {...register("name")}
            type="text"
            id="name"
            placeholder="Name"
          />
        </div>
        <p>{errors.name?.message}</p>
      </div>

      <div className="inputDiv">
        <label htmlFor="email">Email: </label>
        <div className="input">
          <input
            {...register("email")}
            type="email"
            id="email"
            placeholder="Email"
          />
        </div>
        <p>{errors.email?.message}</p>
      </div>

      {/* Afișează câmpurile pentru parolă doar dacă e ADD USER */}
      {!isEdit && (
        <>
          <div className="inputDiv">
            <label htmlFor="password">Password: </label>
            <div className="input">
              <input
                {...register("password")}
                type="password"
                id="password"
                placeholder="Password"
              />
            </div>
            <p>{errors.password?.message}</p>
          </div>

          <div className="inputDiv">
            <label htmlFor="confirmPassword">Confirm password: </label>
            <div className="input">
              <input
                {...register("confirmPassword")}
                type="password"
                id="confirmPassword"
                placeholder="Confirm password"
              />
            </div>
            <p>{errors.confirmPassword?.message}</p>
          </div>
        </>
      )}

      <div className="inputDiv">
        <label htmlFor="role">Role: </label>
        <div className="input">
          <select {...register("role")} id="role">
            <option value="admin">Admin</option>
            <option value="professor">Professor</option>
          </select>
        </div>
        <p>{errors.role?.message}</p>
      </div>

      <button type="submit" className="btn">
        Save
      </button>
    </form>
  );
};

export default UserForm;
