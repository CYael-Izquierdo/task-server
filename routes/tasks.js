const express = require("express");
const {check} = require("express-validator");
const router = express.Router();

const taskController = require("../controllers/taskController")
const auth = require("../middleware/auth");
const checkValidations = require("../middleware/checkValidations");

// create task
// api/tasks
router.post("/",
    auth,
    [
        check("name", "task name is required").not().isEmpty(),
        check("projectId", "project is required").not().isEmpty()
    ],
    checkValidations,
    taskController.createTask
);

// Upload project tasks
router.put("/:id",
    auth,
    taskController.updateTask
);

router.delete("/:id",
    auth,
    taskController.deleteTask
);

module.exports = router;
