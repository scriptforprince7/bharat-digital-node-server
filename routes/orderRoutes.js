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
  const { product_id, quantity } = req.body;
  console.log(product_id, quantity);

  try {
    const productResponse = await axios.get(`http://localhost:8000/api/products/${product_id}/`, {
      headers: { Authorization: `Bearer ${process.env.DJANGO_TOKEN}` },
    });

    const product = productResponse.data;
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    const total_price = product.price * quantity;
    const newOrder = await createOrder(product_id, quantity, total_price, 'Pending');

    res.status(201).json(newOrder);

    // Pass product name and order details to email
    sendNotification(newOrder, product.name);
  } catch (error) {
    console.error('Order creation failed:', error.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
});


module.exports = router;
