const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const { check, validationResult } = require("express-validator");
require("dotenv").config();

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

const formatValidationErrors = (validationErrors) => {
  let output = {};

  validationErrors.forEach((error) => {
    if (error.path in output) {
      output[error.path].push(error.msg);
    } else {
      output[error.path] = [error.msg];
    }
  });

  return output;
};

const taskValidationRules = [
  check("name")
    .notEmpty()
    .withMessage("This field is required.")
    .isLength({ min: 10, max: 255 })
    .withMessage("This field must be between 10 and 255 characters inclusive."),
  check("description")
    .notEmpty()
    .withMessage("This field is required.")
    .isLength({ min: 10 })
    .withMessage("This field must be at least 10 chacacters inclusive."),
  check("completed")
    .isBoolean()
    .withMessage("This field must be at a boolean character."),
];

router.post("/", taskValidationRules, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: formatValidationErrors(errors.array()) });
  }

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

router.get("/", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    } else {
      res.status(200).json({ data: results });
    }
  });
});

router.get("/:id", (req, res) => {
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

router.put("/:id", taskValidationRules, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: formatValidationErrors(errors.array()) });
  }

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

module.exports = router;
