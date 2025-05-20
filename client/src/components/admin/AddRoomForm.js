import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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
    <div className="max-w-[800px] mx-auto my-10 p-4 md:p-6 bg-white/50 backdrop-blur-xl rounded-lg shadow-sm border-2 border-white/60">
      <h1 className="text-lg text-gray-800 font-semibold mb-3 pb-2 border-b-2 border-purple-500/40">
        Add New Room
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-0">
        <div className="mb-3 flex flex-col md:flex-row md:items-start">
          <label
            htmlFor="name"
            className="font-medium text-gray-700 text-sm md:w-[100px] md:pt-1.5 mb-1 md:mb-0"
          >
            Room Name
          </label>

          <div className="flex-1 flex flex-col">
            <input
              id="name"
              type="text"
              placeholder="e.g. 2203"
              {...register("name")}
              className="px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
        </div>

        {errors.name && (
          <div className="bg-red-50/80 text-red-500 p-2 rounded-md mb-3 border-l-3 border-red-500">
            {errors.name.message}
          </div>
        )}

        <button
          type="submit"
          className="bg-purple-600 text-white border-none rounded-md px-5 py-2 text-sm font-medium cursor-pointer transition-all shadow-sm shadow-purple-500/10 mt-3 block ml-auto hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-500/20 active:translate-y-0.5"
        >
          Add Room
        </button>
      </form>
    </div>
  );
};

export default AddRoomForm;
