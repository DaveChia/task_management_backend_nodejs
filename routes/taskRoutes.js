const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskControllers");
const taskValidationRules = require("../validationRules/taskValidationRules");

router.get("/:id", taskController.getTask);
router.get("/", taskController.getTasks);
router.post(
  "/",
  taskValidationRules.createOrEditTaskValidationRules,
  taskController.createTask
);
router.put(
  "/:id",
  taskValidationRules.createOrEditTaskValidationRules,
  taskController.editTask
);

module.exports = router;
