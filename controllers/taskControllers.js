const mysqlDb = require("../databases/mysqlDb");
const helper = require("../utilities/helperFunctions");
const { validationResult } = require("express-validator");

exports.getTasks = (req, res) => {
  mysqlDb.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    } else {
      res.status(200).json({ data: results });
    }
  });
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

  mysqlDb.query("INSERT INTO tasks SET ?", newItem, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to create a task" });
    } else {
      res.status(201).json({ message: "task created successfully" });
    }
  });
};

exports.getTask = (req, res) => {
  const itemId = req.params.id;
  mysqlDb.query(
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
};

exports.editTask = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: helper.formatValidationErrors(errors.array()) });
  }

  const itemId = req.params.id;
  const updatedItem = req.body;
  mysqlDb.query(
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
};
