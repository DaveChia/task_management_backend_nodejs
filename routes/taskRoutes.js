const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const taskController = require("../controllers/taskControllers");

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

router.post("/", taskValidationRules, taskController.createTask);
router.get("/:id", taskController.getTask);
router.get("/", taskController.getTasks);
router.put("/:id", taskController.editTask);

module.exports = router;
