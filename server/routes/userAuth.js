const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const Planner = require('../models/Planner'); 


function generateRandomKey(length) {
    return crypto.randomBytes(length).toString("hex");
}

const secretKey = generateRandomKey(32);

router.post("/login", async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;
        const isEmail = /\S+@\S+\.\S+/.test(emailOrUsername);

        // Check user's input
        let user;
        if (isEmail) {
            user = await User.findOne({ email: emailOrUsername });
        } else {
            user = await User.findOne({ username: emailOrUsername });
        }

        // Authentication
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user has a planner, if not, create one
        let planner = await Planner.findOne({ user_id: user._id });
        if (!planner) {
            planner = new Planner({ user_id: user._id }); // Removed the const
            await planner.save()
            .then(savedPlanner => {
                console.log('Planner saved successfully!', savedPlanner);
            })
            .catch(error => {
                console.error('Error saving planner:', error);
            });

            user.planner = planner._id;
            await user.save();
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, secretKey, {
            expiresIn: "1h",
        });

        // Set the token as a cookie
        res.cookie("token", token, { httpOnly: true });

        res.status(200).json({
            message: "Login successful",
            user: { id: user._id, username: user.username },
            token: token,
        });

         

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error occurred while processing login.",
            error: error.message,
        });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
});

router.post("/validate", async (req, res) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, secretKey);
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Token is valid", user });
    } catch (error) {
        // If the token is invalid or has expired
        // console.log("Invalid token");
        return res.status(401).json({ message: "Invalid token" });
    }
});

module.exports = router;
