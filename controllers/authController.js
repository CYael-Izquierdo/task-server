const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");

exports.userAuthentication = async (req, res) => {
    // validate errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // get email and password
    const {email, password} = req.body;

    try {
        // Verify that user is unique
        let user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({msg: "There is no registered user with that email."});
        }

        // Verify password
        const isCorrect = await bcryptjs.compare(password, user.password);
        if (!isCorrect) {
            return res.status(401).json({msg: "Incorrect password."});
        }

        // Correct credentials

        // Create and sign JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign jwt
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600,
        }, (error, token) => {
            if (error) throw error;
            res.status(200).json({
                msg: "Successful logging.",
                token
            });
        });
    } catch (e) {
        console.log(e);
    }
}

// get authenticated user
exports.userAuthenticated = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (e) {
        console.log(e);
        res.status(500).json({msg: "Unexpected error"});
    }
}
