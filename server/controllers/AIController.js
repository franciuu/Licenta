import axios from "axios";
import markAttendance from "../services/attendanceService.js";
import Student from "../models/Student.js";

export const triggerGenerateEmbeddings = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:5001/generate-embeddings"
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Eroare la generare embeddings:", error);
    res.status(500).json({ error: "Eroare la generare embeddings." });
  }
};

export const getRecognize = async (req, res) => {
  try {
    const { imageData, activityId } = req.body;

    const cleanedImage = imageData.replace(/^data:image\/\w+;base64,/, "");

    const pyRes = await axios.post("http://localhost:5001/recognize", {
      imageData: cleanedImage,
    });

    const results = pyRes.data;

    let newRecognized = [];

    for (const result of results) {
      const { student } = result;

      if (student) {
        console.log(`✅ Student recunoscut: ${student}`);

        const studentDb = await Student.findByPk(student);
        const { created } = await markAttendance(student, activityId);

        if (created && studentDb) {
          newRecognized.push({ uuid: student, name: studentDb.name });
        }
      } else {
        console.log(`❌ Nicio potrivire - fața nu a fost recunoscută`);
      }
    }

    res.json({
      recognized_faces: newRecognized,
    });
  } catch (error) {
    console.error("Eroare în recunoaștere:", error);
    res.status(500).json({ error: "Eroare la recunoaștere" });
  }
};
