const express = require('express');
const axios = require('axios');
const { createOrder } = require('../models/orderModel');
const { sendEmailNotification } = require('../notifications/emailNotification');

const router = express.Router();

const sendNotification = (order, productName) => {
  console.log(`Notification: New order created - ${JSON.stringify(order)}`);
  sendEmailNotification(order, productName); // Pass product name to email function
};

router.post('/orders', async (req, res) => {
  const { products, email } = req.body; // Take multiple products as array
  console.log(products, email);

  try {
    let totalPrice = 0;
    let productDetails = [];

    for (const item of products) {
      const productResponse = await axios.get(
        `http://localhost:8000/api/products/${item.product_id}/`,
        {
          headers: { Authorization: `Bearer ${process.env.DJANGO_TOKEN}` },
        }
      );

      const product = productResponse.data;

      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${product.name}` });
      }

      const itemPrice = product.price * item.quantity;
      totalPrice += itemPrice;

      productDetails.push({
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        total: itemPrice,
      });

      await createOrder(item.product_id, item.quantity, itemPrice, 'Pending');
    }

    res.status(201).json({ message: "Order placed successfully!" });

    sendEmailNotification({ email, totalPrice, productDetails });
  } catch (error) {
    console.error('Order creation failed:', error.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
});



module.exports = router;
