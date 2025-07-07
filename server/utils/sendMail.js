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

export async function sendPasswordResetEmail(to, name, resetUrl) {
  const mailOptions = {
    from: process.env.MAIL_BOT,
    to,
    subject: `Resetare parolă Vision Roster`,
    html: `<p>Bună, ${name}!</p>
      <p>Ai cerut resetarea parolei. Pentru a seta o parolă nouă, apasă pe linkul de mai jos:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Dacă nu ai cerut tu acest lucru, ignoră acest email.</p>
      <p>Linkul este valabil 1 oră.</p>
      <p>Cu stimă,<br>Echipa Vision Roster</p>`,
  };
  return transporter.sendMail(mailOptions);
}
