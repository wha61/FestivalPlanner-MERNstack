const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

router.post("/", async (req, res) => {
    try {
        const { username, fname, lname, email, password, role } = req.body;

        const existingUserByUsername = await User.findOne({ username });
        const existingUserByEmail = await User.findOne({ email });

        if (existingUserByUsername || existingUserByEmail) {
            return res.status(409).json({
                message: "User with this username or email already exists.",
                existingUsername: existingUserByUsername ? true : false,
                existingEmail: existingUserByEmail ? true : false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            fname,
            lname,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error occurred while saving user.",
            error: error.message,
        });
    }
});

module.exports = router;
