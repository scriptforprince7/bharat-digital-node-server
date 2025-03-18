require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orderRoutes');
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

const allowedOrigins = [
    "http://localhost:3000/", // Your front-end URL
    "http://localhost:3000",
  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Reject the request
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow credentials (cookies, authorization headers)
    optionsSuccessStatus: 204, // Some legacy browsers choke on 204
  };
  
  // Use CORS with options
  app.use(cors(corsOptions));
  app.use(express.json()); // For parsing application/json
  app.use(express.urlencoded({ extended: true }));

app.use('/api', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Node server running on port ${PORT}`));
