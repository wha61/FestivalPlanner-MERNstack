const express = require("express");

const profileRoutes = express.Router();

let User = require("../models/User");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

profileRoutes.post("/newuser", function (req, res) {
    try {
        const { username, fname, lname, email, role, socials } = req.body;
        const userprof = new User({
            username,
            fname,
            lname,
            email,
            role,
            socials,
        });
        const savedProfile = userprof.save();
        res.status(200).json({ message: "User added successfully" });
    } catch (error) {
        res.status(400).send("Unable to add user to the database");
    }
});

profileRoutes.get("/allprofile", async function (req, res) {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

profileRoutes.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user);
        if (!user) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.json(user);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

profileRoutes.put("/edit/:id", async (req, res) => {
    try {
        const { username, email, fname, lname, password, socials, newPassword, newPasswordConfirm } = req.body;

        // 哈希新密码
        const hashedPassword = newPassword ? await bcrypt.hash(newPassword, 10) : null;

        // 检查是否有相同用户名的用户
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername && existingUserByUsername._id.toString() !== req.params.id) {
            return res.status(409).json({
                message: "该用户名的用户已经存在。"
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "找不到用户" });
        }

        // 检查当前密码是否有效
        const isPasswordValid = password ? await bcrypt.compare(password, user.password) : null;
        if (password && !isPasswordValid) {
            return res.status(401).json({ message: "密码错误" });
        }

        // 更新用户信息
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                username: username,
                fname: fname,
                lname: lname,
                email: email,
                socials: socials,
                password: hashedPassword || user.password,
            },
            { new: true }
        );

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Delete a user by ID
profileRoutes.delete("/profile/:id", async (req, res) => {
    try {
        console.log(req.params.id);
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.json(deletedUser);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = profileRoutes;
