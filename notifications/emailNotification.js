const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmailNotification = (order, productName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'scriptforprince@gmail.com',
    subject: 'Order Confirmation',
    text: `Your order for ${order.quantity} x ${productName} has been placed successfully. Total price: ₹${order.total_price}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error.message || error.response || error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = { sendEmailNotification };
