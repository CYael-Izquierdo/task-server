const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
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

        if (user) {
            return res.status(400).json({msg: "The user is already registered."});
        }

        // Create new user
        user = new User(req.body);

        // Hash password
        // salt help to make different hashes even for the same password
        const salt = await bcryptjs.genSalt(10)
        user.password = await bcryptjs.hash(password, salt);

        // Save user
        await user.save();

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
            res.status(201).json({
                msg: "User successfully created.",
                token
            });
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({msg: "There is an error."});
    }
}