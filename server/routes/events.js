const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const Event = require("../models/Event");
const User = require("../models/User");
const { event } = require("jquery");

// Set multer to save image in './uploads' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            new Date().toISOString().replace(/:/g, "-") + file.originalname
        );
    },
});

const upload = multer({ storage: storage });

// Get all events
router.get("/", async (req, res) => {
    try {
        const events = await Event.find();

        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found" });
        }

        for (const event of events) {
            if (!event.image || !event.image.data || !event.image.contentType) {
                event.image = { data: null, contentType: null };
            }
        }

        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving events" });
    }
});

// Get event by id
router.get("/:id", getEvent, (req, res) => {
    res.json(res.event);
});

async function getEvent(req, res, next) {
    let event;
    try {
        event = await Event.findOne({ event_id: req.params.id });
        if (event == null) {
            return res.status(404).json({ message: "Cannot find event" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.event = event;
    next();
}

// Create new event
router.post("/", upload.single("image"), async (req, res) => {
    const event = new Event({
        event_id: req.body.event_id,
        user_id: req.body.user_id,
        name: req.body.name,
        description: req.body.description,
        start_date: req.body.start_date,
        start_time: req.body.start_time,
        end_date: req.body.end_date,
        end_time: req.body.end_time,
        location: req.body.location,
        playlistLink: req.body.playlistLink,
    });

    // Check if an image was uploaded
    if (req.file) {
        try {
            const webpImageData = await sharp(req.file.path)
                .toFormat("webp")
                .toBuffer();

            event.image.data = webpImageData;
            event.image.contentType = "image/webp";
            fs.unlinkSync(req.file.path);
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: "Error converting image to WebP format" });
        }
    }

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Update event by id
router.patch(
    "/:id/update",
    getEvent,
    upload.single("image"),
    async (req, res) => {
        try {
            console.log("body:", req.body);
            if (req.body.name) {
                res.event.name = req.body.name;
            }
            if (req.body.description) {
                res.event.description = req.body.description;
            }
            if (req.body.start_date) {
                res.event.start_date = req.body.start_date;
            }
            if (req.body.end_date) {
                res.event.end_date = req.body.end_date;
            }
            if (req.body.location) {
                res.event.location = req.body.location;
            }
            if (req.body.location) {
                res.event.playlistLink = req.body.playlistLink;
            }

            // Check if an image was uploaded
            if (req.file) {
                try {
                    const webpImageData = await sharp(req.file.path)
                        .toFormat("webp")
                        .toBuffer();

                    res.event.image.data = webpImageData;
                    res.event.image.contentType = "image/webp";
                    fs.unlinkSync(req.file.path);
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({
                        message: "Error converting image to WebP format",
                    });
                }
            }

            const updatedEvent = await res.event.save();
            console.log("Event updated successfully:", updatedEvent);
            res.json(updatedEvent);
        } catch (err) {
            console.error("Error updating event:", err.message);
            res.status(400).json({ message: err.message });
        }
    }
);

// Delete specific event by id
router.delete("/:id", getEvent, async (req, res) => {
    try {
        const event = await Event.findOne({ event_id: req.params.id });
        const eventId = event._id;
        console.log("eventId: ", eventId);
        const users = await User.find({ events: eventId });
        console.log("users: ", users);

        for (const user of users) {
            if (user.role === "user") {
                user.events = user.events.filter(
                    (event) => event.toString() !== eventId.toString()
                );
                await user.save();
            }
        }
        console.log("updated users: ", users);

        const result = await Event.deleteOne({ event_id: req.params.id });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Event deleted successfully" });
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
