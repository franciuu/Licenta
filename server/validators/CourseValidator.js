import Course from "../models/Course.js";

export async function validateCourseInput({ name, program }) {
  if (!name || name.trim() === "") {
    return {
      code: 400,
      message: "The name of the course is mandatory.",
    };
  }

  const allowedPrograms = ["Bachelor", "Master"];
  if (!program || !allowedPrograms.includes(program)) {
    return {
      code: 400,
      message: "The program level must be 'Bachelor' or 'Master'.",
    };
  }

  const existing = await Course.findOne({ where: { name } });
  if (existing) {
    return {
      code: 400,
      message: "There is already a course with this name.",
    };
  }
  return null;
}
