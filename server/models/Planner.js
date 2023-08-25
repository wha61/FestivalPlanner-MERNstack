const mongoose = require("mongoose");

const eventInPlannerSchema = new mongoose.Schema({
    event_id: {
        type: String,
        required: true,
    },
    activity_id: [
        {
            type: String,
        },
    ],
});

const plannerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    events: [eventInPlannerSchema],

});

const Planner = mongoose.model("Planner", plannerSchema);

module.exports = Planner;
