const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(userId).populate("events");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const events = user.events;
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error occurred while fetching user's events",
            error: error.message,
        });
    }
});

router.post("/save", async (req, res) => {
    try {
        const { userId, eventId } = req.body;
        console.log(req.body);
        const user = await User.findById(userId);
        console.log(user);
        if (!user.events.includes(eventId)) {
            user.events.push(eventId);
            await user.save();
            console.log(1)
        }
        res.status(200).json({
            message: "Event added to user's saved events",
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error occurred while adding event to user's saved events",
            error: error.message,
        });
    }
});

router.post("/remove", async (req, res) => {
    try {
        const { userId, eventId } = req.body;
        const user = await User.findById(userId);
        const stringEventId = eventId.toString();

        if (user.events.includes(stringEventId)) {
            user.events = user.events.filter(
                (id) => id.toString() !== stringEventId
            );
            await user.save();

            const updatedUser = await User.findById(userId);
            res.status(200).json({
                message: "Event removed from user's saved events",
                user: updatedUser,
            });
        } else {
            res.status(404).json({
                message: "Event not found in user's saved events",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:
                "Error occurred while removing event from user's saved events",
        });
    }
});

router.post("/check-event", async (req, res) => {
    const { userId, eventId } = req.body;

    try {
        const user = await User.findById(userId);
        console.log(user);
        const exists = user.events.includes(eventId);
        res.status(200).json(exists);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error occurred while checking event",
        });
    }
});

module.exports = router;
