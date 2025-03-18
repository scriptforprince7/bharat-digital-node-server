const pool = require('../db');

const createOrder = async (product_id, quantity, total_price, status) => {
  const result = await pool.query(
    'INSERT INTO orders (product_id, quantity, total_price, status, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
    [product_id, quantity, total_price, status]
  );
  return result.rows[0];
};

module.exports = { createOrder };
