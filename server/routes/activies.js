const express = require("express");
const router = express.Router();
const Activity = require("../models/Activies");

// get all activities
router.get("/", async (req, res) => {
    try {
        const activities = await Activity.find();
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get activity by id
router.get("/:id", getActivity, (req, res) => {
    res.json(res.activity);
});

async function getActivity(req, res, next) {
    let activity;
    try {
        activity = await Activity.findOne({ activity_id: req.params.id });
        if (activity == null) {
            return res.status(404).json({ message: "Cannot find activity" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.activity = activity;
    next();
}

// create new activity
router.post("/", async (req, res) => {
    console.log(req.body);
    const activity = new Activity({
        activity_id: req.body.activity_id,
        event_id: req.body.event_id,
        name: req.body.name,
        description: req.body.description,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        location: req.body.location,
    });

    console.log(activity);

    try {
        const newActivity = await activity.save();
        res.status(201).json(newActivity);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// delete activity
router.delete("/:id", getActivity, async (req, res) => {
    console.log(req.params.id);
    try {
        const result = await Activity.deleteOne({ activity_id: req.params.id });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Activity deleted successfully" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// update activity
router.put("/:id", getActivity, async (req, res) => {
    if (req.body.name != null) {
        res.activity.name = req.body.name;
    }
    if (req.body.description != null) {
        res.activity.description = req.body.description;
    }
    if (req.body.start_date != null) {
        res.activity.start_date = req.body.start_date;
    }
    if (req.body.end_date != null) {
        res.activity.end_date = req.body.end_date;
    }
    if (req.body.location != null) {
        res.activity.location = req.body.location;
    }

    try {
        const updatedActivity = await res.activity.save();
        res.json(updatedActivity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// get all activities for a specific event
router.get("/event/:eventId", async (req, res) => {
    try {
        const activities = await Activity.find({
            event_id: req.params.eventId,
        });
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
