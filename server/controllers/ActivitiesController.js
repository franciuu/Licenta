import Activity from "../models/Activity.js";

export const getActivities = async (req, res) => {
  try {
    const response = await Activity.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
