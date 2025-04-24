import { sendPresenceEmail, sendSummaryEmail } from "../utils/sendMail.js";
export const sendMail = async (req, res) => {
  const {
    students,
    attendancesCount,
    activity,
    professorName,
    professorEmail,
  } = req.body;
  try {
    const summary = [];
    for (const student of students) {
      await sendPresenceEmail(
        student.email,
        student.name,
        attendancesCount[student.uuid],
        activity,
        professorName
      );
      summary.push(
        `${student.name} (${student.email}) — ${
          attendancesCount[student.uuid]
        } prezențe`
      );
    }
    res.status(200).json({
      success: true,
      message: "Emailuri trimise + rezumat către profesor",
    });
    await sendSummaryEmail(professorEmail, professorName, activity, summary);
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
