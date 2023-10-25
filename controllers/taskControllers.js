const mysqlDb = require("../databases/mysqlDb");
const helper = require("../utilities/helperFunctions");
const { validationResult } = require("express-validator");

exports.getTasks = (req, res) => {
  mysqlDb.query(
    "SELECT id, name, description, completed, created_at FROM tasks ORDER BY completed ASC, id ASC",
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Failed to retrieve tasks" });
      } else {
        res.status(200).json({ data: results });
      }
    }
  );
};

exports.createTask = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: helper.formatValidationErrors(errors.array()) });
  }

  const { name, description, completed } = req.body;
  const newItem = { name, description, completed };

  mysqlDb.query(
    "INSERT INTO tasks SET name = ?, description = ?, completed = ?, created_at = NOW(), updated_at = NOW()",
    [newItem.name, newItem.description, newItem.completed],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Failed to retreive tasks" });
      } else {
        res.status(201).json({ message: "task created successfully" });
      }
    }
  );
};

exports.getTask = (req, res) => {
  const itemId = req.params.id;
  mysqlDb.query(
    "SELECT id, name, description, completed, created_at, updated_at FROM tasks WHERE id = ? LIMIT 1",
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
};

exports.editTask = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: helper.formatValidationErrors(errors.array()) });
  }

  const itemId = req.params.id;

  const { name, description, completed } = req.body;
  const updatedItem = { name, description, completed };

  mysqlDb.query(
    "UPDATE tasks SET name = ?, description = ?, completed = ?, updated_at = NOW() WHERE id = ?",
    [updatedItem.name, updatedItem.description, updatedItem.completed, itemId],
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
};
