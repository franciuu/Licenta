import axios from "axios";
import markAttendance from "../services/attendanceService.js";

export const getRecognize = async (req, res) => {
  try {
    const { imageData, activityId } = req.body;

    // console.log(
    //   "Imaginea primită:",
    //   imageData ? imageData.slice(0, 100) : "Nicio imagine"
    // );
    // console.log("ID Activitate:", activityId);

    const cleanedImage = imageData.replace(/^data:image\/\w+;base64,/, "");

    const pyRes = await axios.post("http://localhost:5001/recognize", {
      imageData: cleanedImage,
    });

    const { identity, confidence } = pyRes.data;
    let newRecognized = [];

    if (identity && confidence >= 0.5) {
      console.log(identity);
      const { created } = await markAttendance(identity, activityId);
      if (created) {
        newRecognized.push({ name: identity });
      }
    } else {
      console.log("Nasol");
    }

    res.json({
      recognized_faces: newRecognized,
    });
  } catch (error) {
    console.error("Eroare în recunoaștere:", error);
    res.status(500).json({ error: "Eroare la recunoaștere" });
  }
};
