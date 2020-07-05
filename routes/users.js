const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const userController = require("../controllers/userController");

// Create user
// api/users

router.post("/",
    [
        check("name", "User name is required.").not().isEmpty(),
        check("email", "Enter valid email").isEmail(),
        check("password", "User password must has at least 6 characters").isLength({min: 6})
    ],
    userController.createUser);

module.exports = router;