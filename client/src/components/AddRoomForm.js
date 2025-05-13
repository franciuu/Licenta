import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import style from "../styles/AddRoomForm.module.css";

const addRoomSchema = Yup.object().shape({
  name: Yup.string().required("Room name is required."),
});

const AddRoomForm = ({ onAddRoom }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addRoomSchema),
  });

  const onSubmit = async (data) => {
    await onAddRoom(data.name);
    reset();
  };
  return (
    <div className={style.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name" className={style.formLabel}>
          Room Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="e.g. 2203"
          {...register("name")}
          className={style.input}
        />
        {errors.name && (
          <p className={style.errorMessage}>{errors.name.message}</p>
        )}
        <button type="submit" className={style.submitButton}>
          Add Room
        </button>
      </form>
    </div>
  );
};

export default AddRoomForm;
