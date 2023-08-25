const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    activity_id: {
        type: String,
        required: true,
        unique: true,
    },
    event_id: {
        type: String,
        ref: "Event",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
