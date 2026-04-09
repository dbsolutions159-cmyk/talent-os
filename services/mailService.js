const nodemailer = require("nodemailer");

// TRANSPORT
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🔥 SEND ASSESSMENT MAIL
const sendAssessmentMail = async (email, name, candidateId) => {

  const link = `http://localhost:5000/assessment.html?id=${candidateId}`;

  const mailOptions = {
    from: `"DB Hire AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Assessment Invitation - DB Hire AI",
    html: `
      <div style="font-family: Arial; padding:20px">
        <h2>Hello ${name}</h2>

        <p>You are shortlisted for next round.</p>

        <p><b>Candidate ID:</b> ${candidateId}</p>

        <a href="${link}" 
           style="display:inline-block;padding:12px 25px;background:#000;color:#fff;text-decoration:none;border-radius:5px;">
           Start Assessment
        </a>

        <p style="margin-top:20px;color:#666">
          This is a secure link. Do not share.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendAssessmentMail };