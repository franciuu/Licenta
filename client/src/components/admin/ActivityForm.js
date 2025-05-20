import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const timeToMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const addActivitySchema = Yup.object().shape({
  name: Yup.string().required("Name is required."),
  idCourse: Yup.string().required("Course is required."),
  idProf: Yup.string().required("Professor is required."),
  idSemester: Yup.string().required("Semester is required."),
  idRoom: Yup.string().required("Room is required."),
  dayOfWeek: Yup.number()
    .typeError("Day of week must be a number.")
    .transform((value, originalValue) => Number(originalValue))
    .min(0, "Invalid day.")
    .max(6, "Invalid day.")
    .required("Day of week is required."),
  type: Yup.string()
    .oneOf(["lecture", "seminar"], "Type must be seminar or lecture.")
    .required("Type is required."),
  startTime: Yup.string().required("Start time is required."),
  endTime: Yup.string()
    .required("End time is required.")
    .test(
      "is-after-start",
      "End time must be after start time.",
      function (value) {
        const { startTime } = this.parent;
        return (
          !startTime ||
          !value ||
          timeToMinutes(value) > timeToMinutes(startTime)
        );
      }
    ),
});

const ActivityForm = ({
  onSubmit,
  defaultValues,
  courses = [],
  profs = [],
  semesters = [],
  rooms = [],
  error,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addActivitySchema),
    defaultValues,
  });

  return (
    <div className="max-w-[800px] mx-auto p-4 md:p-6 bg-white/50 backdrop-blur-xl rounded-lg shadow-sm border-2 border-white/60">
      <h2 className="text-lg text-gray-800 font-semibold mb-3 pb-2 border-b-2 border-purple-500/40">
        Add Activity
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="mb-0"
      >
        {error && (
          <div className="bg-red-50/80 text-red-500 p-3 rounded-md mb-4 border-l-3 border-red-500">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="name"
            className="font-medium text-gray-700 text-sm mb-1 block"
          >
            Name
          </label>
          <input
            {...register("name")}
            id="name"
            placeholder="e.g. Baze de date, Tip-S, 1092"
            autoFocus
            className="w-full px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="idCourse"
                className="font-medium text-gray-700 text-sm mb-1 block"
              >
                Course
              </label>
              <select
                {...register("idCourse")}
                id="idCourse"
                className="w-full px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
              >
                {courses.map((c) => (
                  <option key={c.uuid} value={c.uuid}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.idCourse && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.idCourse.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="idRoom"
                className="font-medium text-gray-700 text-sm mb-1 block"
              >
                Room
              </label>
              <select
                {...register("idRoom")}
                id="idRoom"
                className="w-full px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
              >
                {rooms.map((r) => (
                  <option key={r.uuid} value={r.uuid}>
                    {r.name}
                  </option>
                ))}
              </select>
              {errors.idRoom && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.idRoom.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="startTime"
                className="font-medium text-gray-700 text-sm mb-1 block"
              >
                Start time
              </label>
              <input
                {...register("startTime")}
                id="startTime"
                type="time"
                className="w-full px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
              />
              {errors.startTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.startTime.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dayOfWeek"
                className="font-medium text-gray-700 text-sm mb-1 block"
              >
                Day of week
              </label>
              <select
                {...register("dayOfWeek")}
                id="dayOfWeek"
                className="w-full px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
              >
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
              </select>
              {errors.dayOfWeek && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dayOfWeek.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="type"
                className="font-medium text-gray-700 text-sm mb-1 block"
              >
                Type
              </label>
              <select
                {...register("type")}
                id="type"
                className="w-full px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
              >
                <option value="seminar">Seminar</option>
                <option value="lecture">Lecture</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="idProf"
                className="font-medium text-gray-700 text-sm mb-1 block"
              >
                Professor
              </label>
              <select
                {...register("idProf")}
                id="idProf"
                className="w-full px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
              >
                {profs.map((p) => (
                  <option key={p.uuid} value={p.uuid}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.idProf && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.idProf.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="endTime"
                className="font-medium text-gray-700 text-sm mb-1 block"
              >
                End time
              </label>
              <input
                {...register("endTime")}
                id="endTime"
                type="time"
                className="w-full px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
              />
              {errors.endTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.endTime.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="idSemester"
                className="font-medium text-gray-700 text-sm mb-1 block"
              >
                Semester
              </label>
              <select
                {...register("idSemester")}
                id="idSemester"
                className="w-full px-3 py-2 border-2 border-purple-500/40 rounded-md text-sm bg-white/40 transition-all focus:outline-none focus:border-purple-600 focus:bg-white/60 focus:shadow-[0_0_0_2px_rgba(142,68,173,0.2)]"
              >
                {semesters.map((s) => (
                  <option key={s.uuid} value={s.uuid}>
                    {s.name} - {s.academic_year?.name || ""}
                  </option>
                ))}
              </select>
              {errors.idSemester && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.idSemester.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-600 text-white border-none rounded-md px-5 py-2 text-sm font-medium cursor-pointer transition-all shadow-sm shadow-purple-500/10 hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-500/20 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
