const express = require("express");
const router = express.Router();
const {check} = require("express-validator");
const authController = require("../controllers/authController");

// Authenticate user
// api/auth

router.post("/",
    [
        check("email", "Enter valid email").isEmail(),
        check("password", "User password must has at least 6 characters").isLength({min: 6})
    ],
    authController.userAuthentication);

module.exports = router;