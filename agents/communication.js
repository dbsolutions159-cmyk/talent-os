const nodemailer = require("nodemailer");

class Communication {
  async notify(shortlisted, job) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const list = shortlisted
        .map(c => `${c.name} (Score: ${c.finalScore})`)
        .join("\n");

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.HR_EMAIL || job.hrEmail,
        subject: `AI Shortlisted Candidates - ${job.title}`,
        text: `
AI has shortlisted candidates:

${list}

Login and approve/reject.
        `
      });

      console.log("📧 HR notified");

    } catch (err) {
      console.warn("Email failed:", err.message);
    }
  }
}

module.exports = Communication;