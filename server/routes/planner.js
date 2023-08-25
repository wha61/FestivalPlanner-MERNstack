const express = require('express');
const router = express.Router();
const Planner = require('../models/Planner'); 

// Create a new planner
router.post('/', async (req, res) => {
  try {
    const user_id = req.body.user; // Assuming user ID is sent in the request body
    const user = await User.findById(user_id); // Assuming User model is available

    if (user.planner) {
      res.status(400).json({ message: 'Planner already exists for this user.' });
      return;
    }

    const planner = new Planner({ user: user._id });
    await planner.save();

    // Optionally, you can add the planner ID to the user document
    user.planner = planner._id;
    await user.save();

    res.json(planner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Update an activity
router.put("/:userId/event/:eventId", async (req, res) => {
  const { userId, eventId } = req.params;
  const { activities } = req.body;

  console.log(`Received request to update planner for user ${userId}, event ${eventId}, activities ${activities}`);

  try {
    let planner = await Planner.findOne({ user_id: userId });

    // Check if planner is null
    if (!planner) {
      res.status(404).json({ message: "Planner not found" });
      return;
    }

    const eventIndex = planner.events.findIndex(e => e.event_id === eventId);

    if (eventIndex > -1) {
      planner.events[eventIndex].activity_id = activities;
    } else {
      planner.events.push({ event_id: eventId, activity_id: activities });
    }

    await planner.save();
    res.status(200).json(planner);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating planner");
  }
});


// Define a simple GET endpoint that responds with a 200 status code
router.get("/ping", (req, res) => {
  res.status(200).json({ message: "Pong!" });
});


module.exports = router;
