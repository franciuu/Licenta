import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function sendPresenceEmail(
  to,
  studentName,
  presenceCount,
  activity,
  professorName
) {
  const mailOptions = {
    from: process.env.MAIL_BOT,
    to,
    subject: `Situația prezențelor la activitatea ${activity}`,
    html: `<p>Bună, ${studentName}!</p>
        <p>Ai înregistrat ${presenceCount} prezențe până acum.</p>
        <p>Cu stimă,<br>${professorName}</p>`,
  };
  return transporter.sendMail(mailOptions);
}

export async function sendSummaryEmail(profEmail, profName, activity, summary) {
  const mailOptions = {
    from: process.env.MAIL_BOT,
    to: profEmail,
    subject: `Rezumat emailuri trimise - ${activity}`,
    html: `
      <p>Bună, ${profName}!</p>
      <p>Au fost trimise emailuri către următorii studenți pentru activitatea ${activity}:</p>
      <ul>
        ${summary.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <p>Toate mesajele au fost trimise cu succes prin Vision Roster Bot.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
