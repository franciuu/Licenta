import Activity from "../models/Activity.js";

export const getActivities = async (req, res) => {
  try {
    const response = await Activity.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createActivity = async (req, res) => {
  const { name, startTime, endTime, room, idCourse, idProf, dayOfWeek } =
    req.body;
  console.log(req.body);
  try {
    await Activity.create({
      name: name,
      startTime: startTime,
      endTime: endTime,
      room: room,
      idCourse: idCourse,
      idProf: idProf,
      dayOfWeek: dayOfWeek,
    });
    res.status(201).json({ msg: "Successful" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
