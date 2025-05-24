import axios from "axios";
import markAttendance from "../services/attendanceService.js";
import Student from "../models/Student.js";
import Enrollment from "../models/Enrollment.js";

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
        console.log(`Student recunoscut: ${student}`);

        const studentDb = await Student.findByPk(student);
        if (!studentDb) {
          console.log(`Studentul nu există în baza de date`);
          continue;
        }

        const isEnrolled = await Enrollment.findOne({
          where: {
            idStudent: student,
            idActivity: activityId,
          },
        });
        if (!isEnrolled) {
          console.log(
            `Studentul ${student} nu este înscris la activitatea ${activityId}`
          );
          continue;
        }

        const { created } = await markAttendance(student, activityId);
        if (created) {
          newRecognized.push({ uuid: student, name: studentDb.name });
        }
      } else {
        console.log(`Nicio potrivire - fața nu a fost recunoscută`);
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
