const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmailNotification = (order) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const productList = order.productDetails
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} - ${item.quantity} x ₹${item.price} = ₹${item.total}`
    )
    .join("\n");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.email,
    subject: 'Order Confirmation',
    text: `Your order has been placed successfully!\n\nProducts:\n${productList}\n\nTotal Price: ₹${order.totalPrice.toFixed(
      2
    )}\n\nThank you for shopping with us!`,
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

