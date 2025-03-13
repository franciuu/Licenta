import axios from "axios";
import markAttendance from "../services/attendanceService.js";

export const getRecognize = async (req, res) => {
  try {
    const { imageData, activityId } = req.body;

    console.log(
      "Imaginea primită:",
      imageData ? imageData.slice(0, 100) : "Nicio imagine"
    );
    console.log("ID Activitate:", activityId);

    const pyRes = await axios.post("http://localhost:5001/recognize", {
      imageData,
    });

    const { identity, confidence } = pyRes.data;

    if (identity && confidence >= 0.9) {
      await markAttendance(identity, activityId);
    }

    res.json({
      recognized_faces: identity ? [{ name: identity }] : [],
    });
  } catch (error) {
    console.error("Eroare în recunoaștere:", error);
    res.status(500).json({ error: "Eroare la recunoaștere" });
  }
};
