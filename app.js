const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

//  Middleware to authorize api key
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey === process.env.API_KEY) {
    next(); // API key is valid, continue with the request
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

//  Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//  CORS Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_APP_URL,
    methods: "GET,POST,PUT", // HTTP methods to allow
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "accept"],
    preflightContinue: false, // Pass the CORS preflight response to the route handlers
  })
);

//  Routes
app.use("/tasks", apiKeyMiddleware, taskRoutes);

//  Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
