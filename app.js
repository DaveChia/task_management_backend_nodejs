const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

require("dotenv").config();

// Create an Express application
const app = express();
app.use(cors()); //  TODO: Add CORS rules

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/tasks", (req, res) => {
  const { name, description, completed } = req.body;
  const newItem = { name, description, completed };
  db.query("INSERT INTO tasks SET ?", newItem, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to create a task" });
    } else {
      res.status(201).json({ message: "task created successfully" });
    }
  });
});

app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

app.get("/tasks/:id", (req, res) => {
  const itemId = req.params.id;
  db.query(
    "SELECT * FROM tasks WHERE id = ? LIMIT 1",
    [itemId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Failed to fetch task" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Task not found" });
      } else {
        res.status(200).json({ data: result[0] });
      }
    }
  );
});

app.put("/tasks/:id", (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;
  db.query(
    "UPDATE tasks SET ? WHERE id = ?",
    [updatedItem, itemId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Task not found" });
      } else {
        res.status(200).json({ message: "Task updated successfully" });
      }
    }
  );
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
