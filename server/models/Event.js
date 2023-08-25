const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    event_id: {
        type: String,
        required: true,
        unique: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    start_time: {
        type: String,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    end_time: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    playlistLink:{
        type: String,
        required: false
    }
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
