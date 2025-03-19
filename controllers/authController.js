const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require('dotenv').config();

const users = [];

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate OTP
  const otp = Math.floor(1000 + Math.random() * 9000);

  users.push({ username, email, password: hashedPassword, otp, verified: false });

  // Send OTP via email (replace with your SMTP details)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your account",
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error.message || error.response || error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

  res.json({ message: "OTP sent to your email" });
};

const verifyOtp = (req, res) => {
    const { email, otp } = req.body;
    console.log("All users:", users); // Debug log
    console.log("Received:", email, otp);
  
    const user = users.find((u) => u.email === email);
  
    if (user) console.log("User found:", user);
  
    if (user && user.otp == otp) {
      user.verified = true;
      return res.json({ success: true, message: "Account verified!" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  };
  

const login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (user && bcrypt.compareSync(password, user.password) && user.verified) {
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(400).json({ message: "Invalid credentials or unverified account" });
  }
};

module.exports = { signup, login, verifyOtp };