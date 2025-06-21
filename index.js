import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());

// Nodemailer Transporter Config
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // Use true for port 465 (SSL)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email Sending Route
app.post("/sendEmail", async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({ msg: "❌ All fields are required" });
    }

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "📬 New Website Inquiry",
      text: `
        👤 Name: ${name}
        📞 Phone: ${phone}
        📧 Email: ${email}

        📝 Message:
        ${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ msg: "✅ Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email send error:", error);
    return res.status(500).json({ msg: "❌ Failed to send email" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
